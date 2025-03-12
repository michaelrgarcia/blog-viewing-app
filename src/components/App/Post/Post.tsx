import { formatDistanceToNow } from "date-fns";

import { getDateFromDbString } from "../../../utils/dateHelpers";

import CommentType from "../../../types/comment";

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
  const { postId, loading, updatePosts, error } = usePostContext();

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
