import { createSchema, definePermissions, Row, table, string, relationships, ANYONE_CAN } from "@rocicorp/zero";

const user = table("user")
  .columns({
    id: string(),
    name: string(),
    email: string(),
  })
  .primaryKey("id");

const post = table("post")
  .columns({
    id: string(),
    content: string(),
    author_id: string(),
  })
  .primaryKey("id");

const comment = table("comment")
  .columns({
    id: string(),
    content: string(),
    post_id: string(),
    author_id: string(),
  })
  .primaryKey("id");

const postRelationships = relationships(post, ({ one }) => ({
  author: one({
    sourceField: ["author_id"],
    destSchema: user,
    destField: ["id"],
  }),
}));

const commentRelationships = relationships(comment, ({ one, many }) => ({
  author: one({
    sourceField: ["author_id"],
    destSchema: user,
    destField: ["id"],
  }),
  post: many({
    sourceField: ["post_id"],
    destSchema: post,
    destField: ["id"],
  }),
}));

export const schema = createSchema({
  tables: [user, post, comment],
  relationships: [postRelationships, commentRelationships],
});

export type Schema = typeof schema;
export type User = Row<typeof schema.tables.user>;
export type Post = Row<typeof schema.tables.post>;
export type Comment = Row<typeof schema.tables.comment>;

export const permissions = definePermissions(schema, () => ({
  user: {
    row: {
      select: ANYONE_CAN,
    },
  },
  post: {
    row: {
      select: ANYONE_CAN,
    },
  },
  comment: {
    row: {
      select: ANYONE_CAN,
    },
  },
}));
