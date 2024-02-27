import { v } from "convex/values";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

import { getAllOrThrow } from "convex-helpers/server/relationships";

export const getBoards = query({
  args: {
    orgId: v.string(),
    query: v.object({
      fav: v.boolean(),
      q: v.union(v.string(), v.null()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const { orgId, query } = args;

    let boards: {
      _id: Id<"board">;
      _creationTime: number;
      orgId: string;
      title: string;
      authorId: string;
      imageUrl: string;
      authorName: string;
    }[];

    if (query.fav) {
      const userFavs = await ctx.db
        .query("favourite")
        .withIndex("user_org", (q) =>
          q.eq("userId", identity.subject).eq("orgId", orgId)
        )
        .collect();

      const favsBoardsIds = userFavs.map((fav) => fav.boardId);

      boards = await getAllOrThrow(ctx.db, favsBoardsIds);

      boards = boards.map((board) => ({ ...board, isFavourite: true }));
      return boards;
    }

    if (query.q !== null) {
      boards = await ctx.db
        .query("board")
        .withSearchIndex("search", (q) =>
          q.search("title", query.q!).eq("orgId", orgId)
        )
        .collect();
    } else {
      boards = await ctx.db
        .query("board")
        .withIndex("by_orgId", (q) => q.eq("orgId", orgId))
        .order("desc")
        .collect();
    }

    const favs = await ctx.db
      .query("favourite")
      .withIndex("user_org", (q) =>
        q.eq("userId", identity.subject).eq("orgId", orgId)
      )
      .collect();

    const boardsWithFavBool = boards.map((board) => ({
      ...board,
      isFavourite: favs.some((fav) => fav.boardId === board._id),
    }));

    return boardsWithFavBool || [];
  },
});
