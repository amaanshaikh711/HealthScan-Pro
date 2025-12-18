import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-primary/20">
            {/* Background decorative blobs */}
            <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-sky-50 rounded-full blur-[120px] opacity-60 mix-blend-multiply" />
                <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-violet-50 rounded-full blur-[100px] opacity-40 mix-blend-multiply" />
            </div>

            <Sidebar />
            <Navbar />
            <main className="relative z-10 md:ml-64 pt-24 px-8 pb-8 min-h-screen overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
