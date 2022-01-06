import "@/styles/globals.css";
import "focus-visible/dist/focus-visible";
import type { AppProps } from "next/app";
import { extendTheme, ChakraProvider } from "@chakra-ui/react";

import { Global, css } from "@emotion/react";

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
      <Global styles={GlobalStyles} />
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
