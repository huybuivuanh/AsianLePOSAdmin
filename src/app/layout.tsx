import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";

export const metadata = {
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-dvh bg-muted/40">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
