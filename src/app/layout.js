import Navbar from "../components/navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "../components/footer/Footer";
import { ThemeContextProvider } from "../context/ThemeContext";
import ThemeProvider from "../providers/ThemeProvider";
import AuthProvider from "../providers/AuthProvider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UnScripted",
  description: "The best blog app!",
  openGraph: {
    title: "UnScripted",
    description: "The best blog app!",
    images: [
      {
        url: "/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "UnScripted Blog Thumbnail",
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
        url: "/thumbnail.png",
        alt: "UnScripted Blog Thumbnail",
      },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/logo.ico" />
      </Head>
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
