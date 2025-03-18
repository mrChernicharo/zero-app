import "./App.css";
import { useQuery } from "@rocicorp/zero/react";
import { useZero } from "./main";

function App() {
  const z = useZero();
  const [users] = useQuery(z.query.user);
  const [posts] = useQuery(z.query.post.related("author"));
  const [comments] = useQuery(z.query.comment.related("post").related("author"));

  console.log({ users, posts, comments });

  return <div>test</div>;
}

export default App;
