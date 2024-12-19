import type { Metadata } from "next";
import { GeistMono, GeistSans } from "@/assets/font";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenQuest | Quiz",
  description:
    "Generate quizzes to test your knowledge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.className} ${GeistMono.variable} bg-sunny pattern text-zinc-800`}
      >
        {children}
      </body>
    </html>
  );
}
