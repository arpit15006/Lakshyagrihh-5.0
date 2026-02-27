import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    MapPin,
    Wrench,
    Receipt,
    TrendingUp,
    PieChart,
    Menu,
    ChevronRight,
    User
} from 'lucide-react';
import type { UserRole } from '../../constants/auth';
import { hasPermission } from '../../constants/auth';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Vehicle Registry', path: '/vehicles', icon: Car },
    { name: 'Trip Dispatcher', path: '/trips', icon: MapPin },
    { name: 'Maintenance', path: '/maintenance', icon: Wrench },
    { name: 'Trip & Expense', path: '/expenses', icon: Receipt },
    { name: 'Performance', path: '/drivers', icon: TrendingUp },
    { name: 'Analytics', path: '/analytics', icon: PieChart },
];

export function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    const isExpanded = !isCollapsed || isHovered;

    const handleLinkClick = () => {
        // Auto collapse on route change if it was pinned open
        if (!isCollapsed) setIsCollapsed(true);
    };

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { role: 'guest' };
    const role = user.role as UserRole;

    const allowedNavItems = navItems.filter(item => hasPermission(role, item.path));

    return (
        <div
            className={`bg-card border-r border-border h-full flex flex-col shrink-0 transition-all duration-300 ease-in-out z-20 relative ${isExpanded ? 'w-64' : 'w-16'
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="h-16 flex items-center px-4 border-b border-border justify-between">
                <div className={`flex items-center gap-3 overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
                    <h2 className="text-xl font-semibold tracking-tight whitespace-nowrap text-foreground">FleetFlow</h2>
                </div>

                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-all shrink-0 absolute right-3"
                >
                    {isExpanded && !isCollapsed ? <ChevronRight className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
                {allowedNavItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center px-2.5 py-2 text-sm font-medium rounded-lg transition-all ${isActive
                                ? 'bg-muted text-foreground font-semibold shadow-sm'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                                }`}
                        >
                            <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
                            <span className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 hidden w-0'
                                }`}>
                                {item.name}
                            </span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className={`flex items-center ${isExpanded ? 'gap-3' : 'justify-center'} overflow-hidden`}>
                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                        <User className="w-4 h-4" />
                    </div>
                    <div className={`flex flex-col transition-all duration-300 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
                        <span className="text-sm font-medium text-gray-900 truncate">{user.email?.split('@')[0]}</span>
                        <span className="text-xs text-gray-500 capitalize">{role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
