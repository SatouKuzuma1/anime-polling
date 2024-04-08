import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { Inter as FontSans } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import Navbar from "~/components/layout/navbar";
import ThemeProvider from "~/components/providers/theme-provider";
import Footer from "~/components/layout/footer";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-sans",
// });

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "SoraAnime",
  description: "The place that would bring back your favourite anime",
  icons: [{ rel: "icon", url: "/lufy.webp" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${fontSans.variable}`}>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <main className=" bg-[#0F1117]">
              <div className="bg-cover bg-center bg-no-repeat backdrop-sepia-[100%] ">
                <Navbar />

                {children}
                <Footer />
              </div>
            </main>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
