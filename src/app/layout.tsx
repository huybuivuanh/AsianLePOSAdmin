import "./globals.css";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { StoreProvider } from "@/app/providers/StoreProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <AuthProvider>
            <StoreProvider>{children}</StoreProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
