import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
  IconButton,
  Popover,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { GetStaticProps, NextPage } from "next";
import { Calendar, ChevronUp } from "react-feather";
import { useEffect, useRef, useState } from "react";
import { SWRConfig } from "swr";
import { DateRange, Range } from "react-date-range";

import Feed from "@/components/Feed";
import { getKeyInfinite, PostInfo, postsFetcher } from "@/lib/api";
import { isSameDay } from "date-fns";
import { sameRangeDays } from "@/lib/rangeUtil";
import Head from "next/head";

type Fallbacks = (Omit<PostInfo, "date"> & { date: string })[];

interface StaticProps {
  fallbackData: Fallbacks;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (context) => {
  const url = getKeyInfinite(0, null)!;
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

const defaultRange: Range = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const Home: NextPage<StaticProps> = ({ fallbackData }: StaticProps) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [tempRange, setTempRange] = useState<Range>(defaultRange);
  const [range, setRange] = useState<Range | undefined>(undefined);

  const [validating, setValidating] = useState(false);
  const validateChanged = (validating: boolean) => {
    setValidating(validating);
  };

  const topRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <IconButton
        aria-label="Scroll to top"
        icon={<ChevronUp />}
        position="fixed"
        bottom="5"
        right="calc(calc(100vw - 36rem) / 2 - 80px)"
        borderWidth={1}
        shadow="xl"
        zIndex="2"
        display={["none", "none", "inline-flex"]}
        onClick={() => {
          topRef.current?.scrollIntoView({ behavior: "smooth" });
        }}
      />
      <VStack p={["5", "6", "20"]} pt={["10", "14", "20"]} ref={topRef}>
        <Box>
          <HStack mb="6" flexWrap="wrap" gap="3">
            <Box mt="3">
              <Heading mb="2">Spacestagram</Heading>
              <Text>
                {range && range.startDate ? (
                  <>
                    Photos from <b>{range.startDate.toLocaleDateString()}</b>{" "}
                    {range.endDate &&
                    !isSameDay(range.startDate, range.endDate) ? (
                      <>
                        to <b>{range.endDate.toLocaleDateString()}</b>
                      </>
                    ) : null}
                  </>
                ) : (
                  "Your daily feed of astronomy photos."
                )}
              </Text>
            </Box>
            <Spacer
              flexGrow={[0, 1]}
              marginInlineStart={0}
              display={["none", "block"]}
            />
            <HStack marginInlineStart={0}>
              {validating && <Spinner size="sm" />}
              <Popover>
                <PopoverTrigger>
                  <Button leftIcon={<Calendar />}>Change Range</Button>
                </PopoverTrigger>
                <PopoverContent width="fit-content">
                  <Box width="fit-content" m="0">
                    <Flex bg="gray.100" flexDirection="row">
                      <ButtonGroup size="sm" mt="2" ml="9px">
                        <Button
                          onClick={() => setRange(undefined)}
                          isDisabled={!range}
                          variant="outline"
                        >
                          Reset
                        </Button>
                        <Button
                          variant="solid"
                          colorScheme="green"
                          onClick={() => setRange(tempRange)}
                          isDisabled={
                            tempRange && range
                              ? sameRangeDays(tempRange, range)
                              : false
                          }
                        >
                          Apply
                        </Button>
                      </ButtonGroup>
                      <Spacer />
                      <PopoverCloseButton />
                    </Flex>
                    <DateRange
                      moveRangeOnFirstSelection={false}
                      maxDate={new Date()}
                      minDate={new Date(1995, 6, 16)}
                      ranges={[tempRange]}
                      onChange={(item) => setTempRange(item.selection)}
                      editableDateInputs={true}
                    />
                  </Box>
                </PopoverContent>
              </Popover>
            </HStack>
          </HStack>
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
            <Feed
              start={range?.startDate}
              end={range?.endDate}
              validateChanged={validateChanged}
            />
          </SWRConfig>
        </Box>
      </VStack>
    </>
  );
};

export default Home;
