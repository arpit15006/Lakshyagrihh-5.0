import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ThemeToggle } from '../ThemeToggle';

export function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    return (
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shrink-0 z-10 sticky top-0 transition-colors duration-300">
            <div className="flex-1 w-full mr-6">
                <div className="relative max-w-xl">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    <input
                        type="search"
                        placeholder="Search..."
                        className="w-full h-10 pl-10 pr-4 rounded-full border border-border bg-muted/50 hover:bg-muted focus:bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-border transition-all font-medium text-foreground placeholder:text-muted-foreground"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">

                <div className="hidden md:flex flex-1 items-center gap-2 mr-2">
                    <button className="h-9 px-3 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:border-border hover:bg-muted hover:text-foreground transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                        Group By
                    </button>
                    <button className="h-9 px-3 text-sm font-medium text-muted-foreground bg-background border border-border rounded-lg hover:border-border hover:bg-muted hover:text-foreground transition-all shadow-sm focus:outline-none focus:ring-1 focus:ring-ring">
                        Filter
                    </button>
                    <div className="ml-2 border-l border-border pl-4">
                        <ThemeToggle />
                    </div>
                </div>

                <div className="flex items-center pl-6 border-l border-border ml-2">
                    {!user ? (
                        <Button
                            onClick={() => navigate('/login')}
                            className="h-9 px-4 rounded-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                        >
                            Log In
                        </Button>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-3 focus:outline-none rounded-lg p-1 hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-ring">
                                    <div className="flex flex-col text-right hidden lg:flex">
                                        <span className="text-sm font-medium text-foreground leading-none">{user?.email?.split('@')[0] || 'User'}</span>
                                        <span className="text-xs text-muted-foreground mt-1">{user?.role || 'Guest'}</span>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground">
                                        <User className="w-4 h-4" />
                                    </div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 mt-1 bg-popover border-border shadow-md">
                                <div className="flex flex-col space-y-1 p-2 px-3">
                                    <p className="text-sm font-medium leading-none text-foreground">{user?.email?.split('@')[0] || 'User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email || ''}</p>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mt-2">{user?.role || 'Guest'}</p>
                                </div>
                                <DropdownMenuSeparator className="bg-border" />
                                <DropdownMenuItem
                                    className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 m-1 rounded-md"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span className="font-medium">Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </header>
    );
}
