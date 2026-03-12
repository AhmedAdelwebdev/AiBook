import "./globals.css";

export const metadata = {
  title: "Recipe → Sheet AI",
  description: "Extract recipe data using AI and export to Google Sheets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
