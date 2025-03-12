/* eslint-disable react-refresh/only-export-components */

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";

type PostContextType = {
  postId: number;
  loading: boolean;
  error: string;
  updatePosts: () => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
};

const PostContext = createContext<PostContextType>({
  postId: 0,
  loading: false,
  error: "",
  updatePosts: () => {},
  setLoading: () => {},
  setError: () => {},
});

type PostProviderProps = PropsWithChildren & {
  postId: number;
  updatePosts: () => void;
};

export function PostContextProvider({
  children,
  postId,
  updatePosts,
}: PostProviderProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  return (
    <PostContext.Provider
      value={{
        postId,
        loading,
        error,
        updatePosts,
        setLoading,
        setError,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}

export function usePostContext() {
  return useContext(PostContext);
}
