import "./App.css";
import { useQuery } from "@rocicorp/zero/react";
import { useZero } from "./main";
import { type Post } from "../schema";

const ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-";
const idMaker = (length = 12) =>
  Array(length)
    .fill(0)
    .map(() => ID_CHARS.split("")[Math.round(Math.random() * ID_CHARS.length)])
    .join("");

export default function App() {
  return <Home />;
}

export function Home() {
  const z = useZero();
  const [users] = useQuery(z.query.user);
  const [posts] = useQuery(z.query.post);

  return (
    <div>
      <div>Social Hour</div>

      <ul>
        {users.map((u) => (
          <div key={u.id}>{JSON.stringify(u)}</div>
        ))}
      </ul>

      <ul>
        {posts.map((p) => (
          <Post key={p.id} postId={p.id} />
        ))}
      </ul>

      <NewPostForm />
    </div>
  );
}

export function Post({ postId }: { postId: string }) {
  const z = useZero();
  const [post] = useQuery(z.query.post.where("id", postId).related("author").one());
  const [comments] = useQuery(z.query.comment.where("post_id", postId));

  const onDeletePost = () => {
    z.mutate.post.delete({ id: postId });
  };

  return (
    <li>
      <button onClick={onDeletePost}>x</button>

      <div>{post?.author?.name}</div>
      <div>{post?.content}</div>

      <ul>
        {comments.map((c) => (
          <Comment key={c.id} commentId={c.id} />
        ))}
      </ul>
    </li>
  );
}

export function Comment({ commentId }: { commentId: string }) {
  const z = useZero();

  const [comment] = useQuery(z.query.comment.where("id", commentId).one().related("author"));

  return (
    <div style={{ border: "1px solid" }}>
      {comment?.author?.name} - {comment?.content}
    </div>
  );
}

export function NewPostForm() {
  const z = useZero();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const text = formData.get("post") ?? "";
    const newPost = { id: idMaker(), author_id: "u001", content: text.toString() };

    z.mutate.post.insert(newPost);
  };

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column" }}>
      <textarea name="post" id="post"></textarea>
      <button>+ add post</button>
    </form>
  );
}
