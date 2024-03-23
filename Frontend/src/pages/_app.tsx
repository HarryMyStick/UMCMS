import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { useEffect } from "react";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  const clearLocalStorageOnClose = () => {
    window.addEventListener('beforeunload', () => {
      // Clear the session token from local storage
      localStorage.removeItem('sessionId');
    });
  };

  useEffect(() => {
    // Call the function to set up the event listener
    clearLocalStorageOnClose();

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', clearLocalStorageOnClose);
    };
  }, []);
  return (
    <>
      <Head>
        <title>UMCMS</title>
        <meta
          name="description"
          content="UMCMS"
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#251754" />
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="mobile-web-app-capable" content="yes"></meta>
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
