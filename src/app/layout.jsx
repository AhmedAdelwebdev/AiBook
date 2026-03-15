import "./globals.css";

export const metadata = {
  title: "AiBookk"
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
