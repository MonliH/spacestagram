import "@/styles/globals.css";
import "focus-visible/dist/focus-visible";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";

import { Global, css } from "@emotion/react";
import Head from "next/head";

/*
  This will hide the focus indicator if the element receives focus via the mouse,
  but it will still show up on keyboard focus.
*/
const GlobalStyles = css`
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
    box-shadow: none;
  }
`;

const fontStack = `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,\
                    Arial,"Open Sans",sans-serif,\
                    "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"`;

const theme = extendTheme({
  fonts: {
    heading: fontStack,
    body: fontStack,
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Spacetragram</title>
        <meta
          name="description"
          content="Browse the Astronomy Picture of the Day's on Spacetagram!"
        />
      </Head>
      <Global styles={GlobalStyles} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
