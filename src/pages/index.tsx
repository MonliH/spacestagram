import Feed from "@/components/Feed";
import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <VStack p={["5", "6", "20"]} pt={["10", "14", "20"]}>
      <Box>
        <Box mb="6">
          <Heading mb="2">Spacestagram</Heading>
          <Text>Powered by NASA&apos;s awesome API.</Text>
        </Box>
        <Feed />
      </Box>
    </VStack>
  );
};

export default Home;
