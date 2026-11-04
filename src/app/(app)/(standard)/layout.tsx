/** Pages without a section sidebar: full width with page padding. */
export default function StandardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-w-0 px-4 py-4 sm:px-6 sm:py-6">
      {children}
    </main>
  );
}
