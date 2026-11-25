import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { MobileDock } from './MobileDock';
import { Navbar } from './Navbar';

/** App shell: ambient glows, header, routed page, footer and bottom dock. */
export function AppLayout() {
  return (
    <div className="min-h-screen bg-page text-zinc-100 font-sans selection:bg-brand selection:text-ink flex flex-col justify-between relative overflow-x-clip">
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[600px] bg-brand/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-lime-300/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <Outlet />
        </main>
      </div>

      <Footer />
      {/* Outside the z-10 wrapper so the footer can never paint over it */}
      <MobileDock />
    </div>
  );
}
