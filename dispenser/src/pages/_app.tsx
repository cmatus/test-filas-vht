import type { AppProps } from "next/app";

import Template from "@/components/layout/Template/Template";

import { useUI } from "@/store/hooks";

import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const { footerButtons } = useUI();

  return (
    <Template footerComponents={footerButtons}>
      <Component {...pageProps} />
    </Template>
  );
}
