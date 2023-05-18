import Script from "next/script";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* <Script src="@/scripts/verxid.js" /> */}
      <Component {...pageProps} />
    </>
  );
}
