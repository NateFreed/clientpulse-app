import Navbar from '@/components/Navbar';

export default function DashboardsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1 p-6">{children}</main>
    </>
  );
}
