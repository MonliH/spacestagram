import Feed from "@/components/Feed";
import { getKey, PAGE_SIZE, PostInfo, postsFetcher } from "@/lib/api";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import { useEffect } from "react";
import { SWRConfig, SWRConfiguration } from "swr";

type Fallbacks = (Omit<PostInfo, "date"> & { date: string })[];

interface StaticProps {
  fallbackData: Fallbacks;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const url = getKey(0, null)!;
  const result = (await postsFetcher(url)).map((post) => ({
    ...post,
    date: post.date.toISOString(),
  }));
  return {
    props: {
      fallbackData: result,
    },
    revalidate: 10,
  };
};

const Home: NextPage<StaticProps> = ({ fallbackData }: StaticProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <VStack p={["5", "6", "20"]} pt={["10", "14", "20"]}>
      <Box>
        <Box mb="6">
          <Heading mb="2">Spacestagram</Heading>
          <Text>Your daily feed of astronomy photos.</Text>
        </Box>
        <SWRConfig
          value={{
            fallbackData: [
              fallbackData.map((post) => ({
                ...post,
                date: new Date(post.date),
              })),
            ],
          }}
        >
          <Feed />
        </SWRConfig>
      </Box>
    </VStack>
  );
};

export default Home;
