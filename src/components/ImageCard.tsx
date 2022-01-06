import { PostInfo } from "@/lib/api";
import { Box, Button, Collapse, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useState } from "react";

export default function ImageCard({ post }: { post: PostInfo }) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((original) => !original);

  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      maxW="xl"
      minHeight="lg"
      overflow="hidden"
      direction="column"
    >
      <Box position="relative" height="lg" width="100%" flexGrow={1}>
        <Image
          src={post.imageUrl}
          alt={`Image of ${post.title}`}
          layout="fill"
          objectFit="cover"
          priority
        />
      </Box>
      <Box flexShrink={0} flexGrow={show ? 10 : 0} p="5" pt="7">
        <Heading fontSize="2xl">{post.title}</Heading>
        <Text mb="2">{post.date.toLocaleDateString()}</Text>
        <Collapse startingHeight={40} in={show}>
          <Box
            height="100%"
            position="relative"
            _after={{
              bgGradient:
                "linear(to-b, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))",
              position: "absolute",
              bottom: 0,
              content: '""',
              width: "100%",
              height: "100%",
              opacity: show ? 0 : 1,
            }}
          >
            <Text fontSize="sm">{post.explanation}</Text>
          </Box>
        </Collapse>
        <Button size="sm" onClick={toggleShow} mt="3">
          Show {show ? "Less" : "More"}
        </Button>
      </Box>
    </Flex>
  );
}
