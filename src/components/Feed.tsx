import { Button, VStack } from "@chakra-ui/react";
import useSWRInfinite from "swr/infinite";

import ImageCard from "@/components/ImageCard";
import { getKey, PostInfo, postsFetcher } from "@/lib/api";
import { useEffect } from "react";

export default function Feed() {
  const { data, error, size, setSize } = useSWRInfinite(getKey, postsFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateFirstPage: false,
  });

  return (
    <VStack gap="4">
      {data &&
        data
          .flat()
          .map((post: PostInfo) => (
            <ImageCard post={post} key={post.date.toISOString()} />
          ))}
      <Button onClick={() => setSize((original) => original + 1)}>
        Load More
      </Button>
    </VStack>
  );
}
