import type { Metadata, Viewport } from "next";
import "./globals.css";

const APP_NAME = "Lost Cities Scores";
const APP_DESCRIPTION = "A score calculator for the Lost Cities card game.";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  metadataBase: new URL("https://lost-cities-calculator.pages.dev"),
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
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" dir="ltr">
      <head>
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
};

export default RootLayout;
