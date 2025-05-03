// app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TaskProvider } from "@/context/task-context";

const inter = Inter({ subsets: ["latin"] });

/**
 * Metadata for the application
 * @type {import('next').Metadata}
 */
export const metadata = {
  title: "TaskMaster - Task Management App",
  description: "A powerful task management app with recurring tasks",
  generator: 'v0.dev'
};

/**
 * Root layout component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <TaskProvider>
            {children}
          </TaskProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}