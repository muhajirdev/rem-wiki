import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

import { Inter } from "@next/font/google";
import { ThemeContext, useThemeInit } from "../components/theme";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== "undefined") {
  posthog.init("phc_28ZXetgBhfWAdOwUjwvFnsjW1Eg3XOQwDB4bMWyr2Xj", {
    api_host: "https://app.posthog.com",
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === "development") posthog.debug();
    },
  });
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [theme, setTheme] = useThemeInit();
  const router = useRouter();

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture("$pageview");
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);

  return (
    <PostHogProvider client={posthog}>
      <SessionProvider session={session}>
        <ThemeContext.Provider value={[theme, setTheme]}>
          <main
            className={`${inter.variable} bg-slate-900 font-sans text-white`}
          >
            <Component {...pageProps} />
          </main>
        </ThemeContext.Provider>
      </SessionProvider>
    </PostHogProvider>
  );
};

export default trpc.withTRPC(MyApp);
