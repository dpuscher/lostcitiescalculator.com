import type { Metadata, Viewport } from "next";
import "./globals.css";

const APP_NAME = "Lost Cities Score Calculator";
const APP_DESCRIPTION =
  "Free online score calculator for Lost Cities card game. Track points, calculate bonuses, and manage multiple rounds easily. Perfect companion for Lost Cities players.";
const APP_URL = "https://lostcitiescalculator.pages.dev";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  metadataBase: new URL(APP_URL),
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  viewportFit: "cover",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Lost Cities Score Calculator",
  applicationCategory: "Game Application",
  applicationSubCategory: "Score Calculator",
  operatingSystem: "Any",
  description:
    "Online score calculator for the Lost Cities card game. Calculate points, track multiple rounds, and manage game scores easily.",
  url: APP_URL,
  image: new URL("/web-app-manifest-512x512.png", APP_URL),
  keywords: "Lost Cities, score calculator, card game, game management",
  potentialAction: {
    "@type": "ViewAction",
    target: APP_URL,
    name: "Use Calculator",
  },
  inLanguage: "en",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <script type="application/ld+json">{JSON.stringify(JSON_LD)}</script>
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
