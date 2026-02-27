import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function AppLayout() {
    return (
        <div className="flex h-screen bg-background text-foreground font-sans overflow-hidden transition-colors duration-300">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
