import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  board: defineTable({
    orgId: v.string(),
    title: v.string(),
    authorId: v.string(),
    imageUrl: v.string(),
    authorName: v.string(),
  })
    .index("by_orgId", ["orgId"])
    .searchIndex("search", {
      searchField: "title",
      filterFields: ["orgId"],
    }),
  favourite: defineTable({
    userId: v.string(),
    boardId: v.id("board"),
    orgId: v.string(),
  })
    .index("board_user", ["boardId", "userId"])
    .index("user_org", ["userId", "orgId"]),
});
