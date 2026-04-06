import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh bg-gray-100">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
