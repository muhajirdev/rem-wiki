import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

import { Inter } from "@next/font/google";
import { ThemeContext, useThemeInit } from "../components/theme";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [theme, setTheme] = useThemeInit();

  return (
    <SessionProvider session={session}>
      <ThemeContext.Provider value={[theme, setTheme]}>
        <main className={`${inter.variable} bg-slate-900 font-sans`}>
          <Component {...pageProps} />
        </main>
      </ThemeContext.Provider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
