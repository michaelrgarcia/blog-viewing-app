import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

import { getDateFromDbString } from "../../../utils/dateHelpers";

import CommentType from "../../../types/comment";

import { useAuth } from "../../../context/AuthProvider";
import { usePostContext } from "../../../context/PostContextProvider";

import Comment from "../Comment/Comment";

import styles from "./Post.module.css";

interface PostProps {
  title: string;
  author: {
    username: string;
  };
  content: string;
  uploaded: string;
  lastModified: string;
  comments: CommentType[];
}

function Post({
  title,
  author,
  content,
  uploaded,
  lastModified,
  comments,
}: PostProps) {
  const [commentContent, setCommentContent] = useState<string>("");

  const { user } = useAuth();
  const { postId, loading, updatePosts, error, setLoading, setError } =
    usePostContext();

  const uploadTimeFromNow = formatDistanceToNow(getDateFromDbString(uploaded), {
    addSuffix: true,
  });

  const editTimeFromNow = formatDistanceToNow(
    getDateFromDbString(lastModified),
    {
      addSuffix: true,
    }
  );

  const timestamp =
    getDateFromDbString(uploaded).getTime() ===
    getDateFromDbString(lastModified).getTime()
      ? `${uploadTimeFromNow}`
      : `${uploadTimeFromNow} • updated ${editTimeFromNow}`;

  const onContentUpdate = (e: FormEvent<HTMLTextAreaElement>) => {
    if (!loading) {
      setCommentContent(e.currentTarget.value);
    }
  };

  const endpoint = import.meta.env.VITE_MY_BLOG_API;

  const onCreate = async () => {
    if (!loading) {
      try {
        setLoading(true);

        const res = await fetch(`${endpoint}/comments/create`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({
            content: commentContent,
            parentPostId: postId,
          }),
        });

        const { message } = await res.json();

        if (res.ok) {
          setCommentContent("");

          setLoading(false);

          updatePosts();
        } else {
          setError(message);
        }
      } catch (err: unknown) {
        setLoading(false);

        console.error(err);

        setError("Error. Please try adding the comment again.");
      }
    } else {
      setError("Please wait for the creation of the current comment.");
    }
  };

  return (
    <>
      {loading && <p className={styles.loadingText}>Updating...</p>}
      <div className={loading ? styles.postBlur : styles.post}>
        <div className={styles.postInfo}>
          <div className={styles.postDatesContainer}>
            <p className={styles.postDates}>{error ? error : timestamp}</p>
          </div>
          <div className={styles.postTitle}>{title}</div>
          <p className={styles.postedBy}>Posted by</p>
          <p className={styles.postAuthor}>{author.username}</p>
        </div>
        <p className={styles.postContent}>{content}</p>
        <p className={styles.postCommentsHeader}>Comments</p>
        {user ? (
          <>
            <textarea
              name="commentContent"
              id="commentContent"
              className={styles.commentContentTextarea}
              cols={120}
              value={commentContent}
              placeholder="Add a comment"
              onChange={onContentUpdate}
            ></textarea>
            {commentContent && (
              <button
                type="button"
                className={styles.submitComment}
                onClick={onCreate}
              >
                Submit
              </button>
            )}
          </>
        ) : (
          <p>
            You must <Link to="login">log in</Link> to create a comment.
          </p>
        )}
        <div className={styles.postComments}>
          {comments.map(({ id, author, content, uploaded, lastModified }) => (
            <Comment
              id={id}
              author={author}
              content={content}
              uploaded={uploaded}
              lastModified={lastModified}
              updatePosts={updatePosts}
              key={`post-${postId}-comment-${id}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Post;
