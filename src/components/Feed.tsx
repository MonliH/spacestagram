import { Spinner, Text, VStack } from "@chakra-ui/react";
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

export default function Feed() {
  const { fallbackData } = useSWRConfig();
  const { data, error, setSize } = useSWRInfinite(getKey, postsFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateFirstPage: false,
    fallbackData,
  });

  const flatData = data ? data.flat() : placeholder;
  const dataWithPlaceholder = [...flatData, ...placeholder];
  const [liked, setLiked] = usePersistedState<LikedEntires>(
    {},
    "spacestagram_liked"
  );

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) {
      setSize((original) => original + 1);
    }
  }, [inView]);

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
      <Spinner />
    </VStack>
  );
}
