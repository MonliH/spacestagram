import { PostInfo } from "@/lib/api";
import {
  Box,
  Button,
  Collapse,
  Flex,
  Heading,
  Skeleton,
  SkeletonText,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { ForwardedRef, forwardRef, useState } from "react";

function ImageCard(
  {
    post,
    priority = false,
    liked,
    setLiked,
  }: {
    post: PostInfo | null;
    priority?: boolean;
    liked: boolean;
    setLiked: (value: boolean) => void;
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((original) => !original);
  const isLoaded = post !== null;

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Flex
      borderWidth="1px"
      borderRadius="lg"
      maxW="xl"
      minHeight="lg"
      overflow="hidden"
      direction="column"
      ref={ref}
    >
      <Skeleton
        isLoaded={isLoaded && (imageLoaded || typeof window === "undefined")}
      >
        <Box position="relative" height="lg" width="100%" flexGrow={1}>
          {post ? (
            <Image
              src={post.imageUrl}
              alt={`Image of ${post.title}`}
              layout="fill"
              objectFit="cover"
              priority={priority}
              sizes="px"
              onLoadingComplete={() => {
                setImageLoaded(true);
              }}
            />
          ) : (
            <Box width="xl" height="100%"></Box>
          )}
        </Box>
      </Skeleton>
      <Box flexShrink={0} flexGrow={show ? 10 : 0} p="5" pt="7">
        <Skeleton
          isLoaded={isLoaded}
          height={isLoaded ? undefined : "10"}
          mb={isLoaded ? undefined : "1"}
        >
          <Heading lineHeight="1.1" fontSize="2xl">
            {post && post.title}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={isLoaded} mb="2" width="40" height="5">
          <Text>{post && post.date.toLocaleDateString()}</Text>
        </Skeleton>
        <SkeletonText isLoaded={isLoaded} noOfLines={2}>
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
                display: show ? "none" : "block",
              }}
            >
              <Text fontSize="sm">{post && post.explanation}</Text>
            </Box>
          </Collapse>
        </SkeletonText>
        <Skeleton isLoaded={isLoaded} mt="3" width="20">
          <Button size="sm" onClick={toggleShow}>
            Show {show ? "Less" : "More"}
          </Button>
        </Skeleton>
      </Box>
    </Flex>
  );
}
export default forwardRef(ImageCard);
