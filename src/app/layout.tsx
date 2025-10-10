import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
