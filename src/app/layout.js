import { Inter } from "next/font/google";
import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Header from "@components/Header";
import { Toaster } from "react-hot-toast";
import { TaskProvider } from "@/app/context/TaskContext";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Taskify",
  description: "備忘錄清單",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicons/favicon-16x16.png"
        />
      </Head>
      <body className={inter.className}>
        <TaskProvider>
          <Header />
          <Toaster />
          {children}
        </TaskProvider>
      </body>
    </html>
  );
}
