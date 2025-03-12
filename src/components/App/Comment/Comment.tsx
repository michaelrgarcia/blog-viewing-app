import { FormEvent, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { useAuth } from "../../../context/AuthProvider";

import { getDateFromDbString } from "../../../utils/dateHelpers";
import { getParsedJwt } from "../../../utils/jwtHelpers";

import CommentType from "../../../types/comment";

import DeleteComment from "./popups/DeleteComment";

import EditIcon from "./icons/pencil.svg";
import ConfirmEditIcon from "./icons/check.svg";
import DiscardEditIcon from "./icons/pencil-off.svg";

import styles from "./Comment.module.css";

type CommentProps = CommentType & {
  updatePosts: () => void;
};

function Comment({
  id,
  author,
  content,
  uploaded,
  lastModified,
  updatePosts,
}: CommentProps) {
  const [editing, setEditing] = useState<boolean>(false);
  const [editFields, setEditFields] = useState({
    content,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const { user } = useAuth();

  const parsedUser = getParsedJwt(user);

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
      setEditFields({ content: e.currentTarget.value });
    }
  };

  const onEditConfirm = async () => {
    const changesMade = editFields.content !== content;

    if (!changesMade) return setEditing(false);

    if (!loading) {
      try {
        setLoading(true);

        const endpoint = import.meta.env.VITE_MY_BLOG_API;

        const res = await fetch(`${endpoint}/comments/edit`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user}`,
          },
          body: JSON.stringify({ ...editFields, commentId: id }),
        });

        const parsed = await res.json();

        const { message } = parsed;

        if (res.ok) {
          setEditing(false);

          updatePosts();
        } else {
          setError(message);
        }
      } catch (err: unknown) {
        console.error(err);

        setError("Error. Please confirm your changes again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const onStopEdit = () => {
    if (!loading) {
      setEditing(false);

      setEditFields({ content });
    }
  };

  return (
    <div className={styles.comment}>
      <div className={styles.commentAuthorContainer}>
        <div className={styles.commentAuthorAndTimestamp}>
          <p className={styles.commentAuthor}>{author.username}</p>
          <p className={styles.commentTimestamp}>{timestamp}</p>
        </div>
        {editing ? (
          <div className={styles.commentActions}>
            <button
              type="button"
              title="Submit Changes"
              onClick={onEditConfirm}
            >
              <img src={ConfirmEditIcon} alt="Submit Changes" />
            </button>
            <button type="button" title="Stop Editing" onClick={onStopEdit}>
              <img src={DiscardEditIcon} alt="Stop Editing" />
            </button>
          </div>
        ) : parsedUser?.username === author.username ? (
          <div className={styles.commentActions}>
            <button
              type="button"
              title="Edit Comment"
              onClick={() => setEditing(true)}
            >
              <img src={EditIcon} alt="Edit Comment" />
            </button>
            <DeleteComment
              id={Number(id)}
              loading={loading}
              updatePosts={updatePosts}
              setError={setError}
              setLoading={setLoading}
            />
          </div>
        ) : (
          ""
        )}
      </div>
      {editing ? (
        <textarea
          name="newContent"
          id="newContent"
          className={styles.newContentTextarea}
          cols={120}
          rows={10}
          value={editFields.content}
          onChange={onContentUpdate}
        ></textarea>
      ) : (
        <p className={styles.commentContent}>{content}</p>
      )}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red", marginTop: 0 }}>{error}</p>}
    </div>
  );
}

export default Comment;
