import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const imagesArray = [
  "/placeholders/svg1.svg",
  "/placeholders/svg2.svg",
  "/placeholders/svg3.svg",

  "/placeholders/svg4.svg",

  "/placeholders/svg5.svg",

  "/placeholders/svg6.svg",

  "/placeholders/svg7.svg",

  "/placeholders/svg8.svg",

  "/placeholders/svg9.svg",

  "/placeholders/svg10.svg",
];

export const createBoard = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const { orgId, title } = args;

    const randomImage =
      imagesArray[Math.floor(Math.random() * imagesArray.length)];
    const createdBoardId = await ctx.db.insert("board", {
      orgId,
      title,
      imageUrl: randomImage,
      authorId: identity.subject,
      authorName: identity.name || "Unknown",
    });

    return {
      boardId: createdBoardId,
    };
  },
});

export const removeBoard = mutation({
  args: {
    boardId: v.id("board"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const { boardId } = args;

    await ctx.db.delete(boardId);
    return "Succesfully deleted the board";
  },
});

export const updateBoard = mutation({
  args: {
    boardId: v.id("board"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const { boardId, title } = args;

    if (!title) throw new Error("Board Title Required");

    await ctx.db.patch(boardId, { title });

    return "Succesfully updated the board title";
  },
});

export const favouriteBoard = mutation({
  args: {
    boardId: v.id("board"),
    orgId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const { boardId, orgId } = args;

    const favourite = await ctx.db
      .query("favourite")
      .withIndex("board_user", (q) =>
        q.eq("boardId", boardId).eq("userId", identity.subject)
      )
      .unique();

    if (favourite) {
      throw new Error("Board is already favourited");
    }

    await ctx.db.insert("favourite", {
      boardId,
      userId: identity.subject,
      orgId: orgId,
    });

    return "Succesfully favourited board";
  },
});

export const unfavouriteBoard = mutation({
  args: {
    boardId: v.id("board"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) throw new Error("Unauthorized");

    const { boardId } = args;

    const favourite = await ctx.db
      .query("favourite")
      .withIndex("board_user", (q) =>
        q.eq("boardId", boardId).eq("userId", identity.subject)
      )
      .unique();

    if (!favourite) {
      throw new Error("Board is not favourited");
    }

    await ctx.db.delete(favourite._id);

    return "Succesfully unfavourited board";
  },
});

export const getBoard = query({
  args: {
    boardId: v.id("board"),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.boardId);

    return board;
  },
});
