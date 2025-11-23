import { deleteImagesInPath } from "@/api/image";
import { deletePost } from "@/api/post";
import { QUERY_KEYS } from "@/lib/constants";
import type { UseMutationCallback } from "@/types";
import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

export function useDeletePost(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();

      // 이미지 삭제
      if (deletedPost.image_urls && deletedPost.image_urls.length > 0) {
        await deleteImagesInPath(`${deletedPost.author_id}/${deletedPost.id}`);
      }

      // 1. 전체 피드(InfiniteData) 캐시에서 삭제된 postId 제거
      queryClient.setQueryData<InfiniteData<number[]>>(
        QUERY_KEYS.post.list,
        (prev) => {
          if (!prev)
            throw new Error(
              "포스트 리스트를 캐시 데이터에서 찾을 수 없습니다.",
            );

          return {
            ...prev,
            pages: prev.pages.map((page) =>
              page.filter((id) => id !== deletedPost.id),
            ),
          };
        },
      );

      // 2. 프로필 상세 페이지 캐시에서도 삭제된 postId 제거
      queryClient.setQueryData<InfiniteData<number[]>>(
        QUERY_KEYS.post.userList(deletedPost.author_id),
        (prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            pages: prev.pages.map((page) =>
              page.filter((id) => id !== deletedPost.id),
            ),
          };
        },
      );

      // 3. 정규화된 포스트 데이터 제거
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.post.byId(deletedPost.id),
      });
    },

    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}