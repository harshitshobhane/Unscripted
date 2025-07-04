import Navbar from "../components/navbar/Navbar";
import "./globals.css";
import { Inter, Merriweather, Lora, Roboto_Slab, Playfair_Display, Montserrat, Libre_Baskerville } from "next/font/google";
import Footer from "../components/footer/Footer";
import { ThemeContextProvider } from "../context/ThemeContext";
import ThemeProvider from "../providers/ThemeProvider";
import AuthProvider from "../providers/AuthProvider";
import Head from "next/head";
import { Analytics } from "@vercel/analytics/react";

const inter = Inter({ subsets: ["latin"] });
const merriweather = Merriweather({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-merriweather" });
const lora = Lora({ weight: ["400", "500", "600", "700"], subsets: ["latin"], variable: "--font-lora" });
const robotoSlab = Roboto_Slab({ weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"], variable: "--font-roboto-slab" });
const playfairDisplay = Playfair_Display({ weight: ["400", "500", "600", "700", "800", "900"], subsets: ["latin"], variable: "--font-playfair-display" });
const montserrat = Montserrat({ weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], subsets: ["latin"], variable: "--font-montserrat" });
const libreBaskerville = Libre_Baskerville({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-libre-baskerville" });

export const metadata = {
  title: "UnScripted",
  description: "The best blog app!",
  openGraph: {
    title: "UnScripted",
    description: "The best blog app!",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "UnScripted Blog Logo",
      },
    ],
    type: "website",
    locale: "en_US",
    siteName: "UnScripted",
  },
  twitter: {
    card: "summary_large_image",
    title: "UnScripted",
    description: "The best blog app!",
    images: [
      {
        url: "/logo.png",
          alt: "UnScripted Blog Logo",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.ico" />
        <meta name="description" content="The best blog app!" />
        <meta name="author" content="UnScripted Team" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://itsunscripted.vercel.app/" />
        <meta property="og:title" content="UnScripted" />
        <meta property="og:description" content="The best blog app!" />
        <meta property="og:image" content="/logo.png" />
        <meta property="og:image:alt" content="UnScripted Blog Logo" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://itsunscripted.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UnScripted" />
        <meta name="twitter:description" content="The best blog app!" />
        <meta name="twitter:image" content="/logo.png" />
        <meta name="twitter:url" content="https://itsunscripted.vercel.app/" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "UnScripted",
              "url": "https://itsunscripted.vercel.app/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://itsunscripted.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
      </Head>
      <body className={`${inter.className} ${merriweather.variable} ${lora.variable} ${robotoSlab.variable} ${playfairDisplay.variable} ${montserrat.variable} ${libreBaskerville.variable}`}>
        <AuthProvider>
          <ThemeContextProvider>
            <ThemeProvider>
              <div className="container">
                <div className="wrapper">
                  <Navbar />
                  {children}
                  <Footer />
                </div>
              </div>
            </ThemeProvider>
          </ThemeContextProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
