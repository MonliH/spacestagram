import { CircularProgress, Spinner, Text, VStack } from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";

import ImageCard from "@/components/ImageCard";
import { getKey, PAGE_SIZE, PostInfo, postsFetcher } from "@/lib/api";
import { useSWRConfig } from "swr";
import usePersistedState from "@/lib/usePersistedState";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";

const placeholder = new Array(PAGE_SIZE).fill(null);
interface LikedEntires {
  [key: string]: boolean;
}

export default function Feed({
  start,
  end,
  validateChanged,
}: {
  start: Date | undefined;
  end: Date | undefined;
  validateChanged?: (validating: boolean) => void;
}) {
  const { fallbackData } = useSWRConfig();
  const { data, mutate, isValidating, error, size, setSize } = useSWRInfinite(
    getKey(start, end),
    postsFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateFirstPage: false,
      fallbackData,
    }
  );

  const flatData = data ? data.flat() : placeholder;
  const [liked, setLiked] = usePersistedState<LikedEntires>(
    {},
    "spacestagram_liked"
  );

  const { ref, inView } = useInView({ threshold: 0 });
  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
  const done = getKey(start, end)(size - 1, null) === null;
  const dataWithPlaceholder =
    end && done ? flatData : [...flatData, ...placeholder];

  useEffect(() => {
    if (validateChanged) {
      validateChanged(isValidating);
    }
  }, [isValidating]);

  useEffect(() => {
    if (inView && !isLoadingMore && !done) {
      setSize((original) => original + 1);
    }
  }, [inView, isLoadingMore]);

  useEffect(() => {
    mutate();
  }, [start, end]);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <VStack gap="4">
      {dataWithPlaceholder.map((post: PostInfo | null, idx: number) => (
        <ImageCard
          {...(idx === flatData.length - 1 ? { ref } : {})}
          hasMounted={hasMounted}
          post={post}
          key={post?.date.toISOString() || idx}
          priority={idx < 2}
          liked={(post && liked[post.date.toISOString()]) ?? false}
          setLiked={(value: boolean) =>
            post &&
            setLiked((old) => ({ ...old, [post.date.toISOString()]: value }))
          }
        />
      ))}
      {error && <Text color="red">Failed to load more posts.</Text>}
      {isLoadingMore && !done && <Spinner />}
    </VStack>
  );
}
