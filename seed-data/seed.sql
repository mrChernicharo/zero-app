CREATE DATABASE zstart;
CREATE DATABASE zstart_cvr;
CREATE DATABASE zstart_cdb;



\c zstart;

CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT UNIQUE
);

CREATE TABLE "post" (
  "id" TEXT PRIMARY KEY,
  "author_id" TEXT NOT NULL,
  "content" TEXT NOT NULL
);

CREATE TABLE "comment" (
  "id" TEXT PRIMARY KEY,
  "post_id" TEXT NOT NULL,
  "author_id" TEXT NOT NULL,
  "content" TEXT NOT NULL
);


INSERT INTO "user" (id, name, email) VALUES 
  ('u001', 'Alice', 'alice@email.com'),
  ('u002', 'Bob', 'bob@email.com'),
  ('u003', 'Mari', 'mari@email.com');


INSERT INTO "post" (id, content, author_id) VALUES
  ('p001', 'olá mundo', 'u001'),
  ('p002', 'hello world', 'u002');

INSERT INTO "comment" (id, content, author_id, post_id) VALUES
  ('c001', 'liked that 👍', 'u003', 'p001');