import { Button, OrderedList, Spinner, Text, VStack } from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";

import ImageCard from "@/components/ImageCard";
import { getKey, PAGE_SIZE, PostInfo, postsFetcher } from "@/lib/api";
import { useSWRConfig } from "swr";
import usePersistedState from "@/lib/usePersistedState";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const placeholder = new Array(PAGE_SIZE).fill(null);
interface LikedEntires {
  [key: string]: boolean;
}

export default function Feed() {
  const { fallbackData } = useSWRConfig();
  const { data, error, size, setSize } = useSWRInfinite(getKey, postsFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateFirstPage: false,
    fallbackData,
  });

  const [liked, setLiked] = usePersistedState<LikedEntires>(
    {},
    "spacestagram_liked"
  );

  const flatData = (data && data.flat()) || placeholder;

  const { ref, inView, entry } = useInView({ threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      setSize((original) => original + 1);
    }
  }, [inView]);

  return (
    <VStack gap="4">
      {flatData.map((post: PostInfo | null, idx: number) => (
        <ImageCard
          {...(idx === flatData.length - 1 ? { ref } : {})}
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
      <Spinner />
    </VStack>
  );
}
