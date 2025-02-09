import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black h-screen`}>
        {children}
      </body>
    </html>
  );
}
