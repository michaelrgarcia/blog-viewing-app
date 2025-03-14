import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthProvider";
import { PostContextProvider } from "../../context/PostContextProvider";

import PostType from "../../types/post";

import Post from "./Post/Post";

import styles from "./App.module.css";

function App() {
  const [posts, setPosts] = useState<PostType[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onPostsUpdate = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    async function request() {
      try {
        setPosts([]);

        setLoading(true);

        const endpoint = import.meta.env.VITE_MY_BLOG_API;

        const res = await fetch(`${endpoint}/posts/published`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
        });

        const parsed = await res.json();

        setPosts(parsed);
      } catch (err: unknown) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    }

    request();
  }, [user, refresh]);

  return (
    <>
      <header className={styles.appHeader}>
        <h1>My Fake Blog</h1>
        <button
          type="button"
          onClick={user ? () => logout() : () => navigate("/login")}
        >
          {user ? "Log out" : "Log in"}
        </button>
      </header>
      <main>
        {loading && <p>Loading posts...</p>}
        {!loading && error ? <p>Error getting posts. Please refresh.</p> : ""}
        {posts.map(
          ({
            id,
            title,
            author,
            content,
            uploaded,
            lastModified,
            comments,
          }) => (
            <PostContextProvider
              postId={id}
              updatePosts={onPostsUpdate}
              key={`post-${id}`}
            >
              <Post
                title={title}
                author={author}
                content={content}
                uploaded={uploaded}
                lastModified={lastModified}
                comments={comments}
              />
            </PostContextProvider>
          )
        )}
      </main>
    </>
  );
}

export default App;
