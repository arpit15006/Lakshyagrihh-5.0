import * as React from "react"
import { useState } from 'react';

interface TooltipProps {
    children: React.ReactElement;
    content: React.ReactNode;
    side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, content, side = 'top' }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    const positionStyles: Record<string, string> = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    return (
        <div className="relative inline-flex" onMouseEnter={() => setIsVisible(true)} onMouseLeave={() => setIsVisible(false)}>
            {children}
            {isVisible && (
                <div className={`absolute z-50 ${positionStyles[side]} animate-in fade-in zoom-in-95 duration-150`}>
                    <div className="rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 shadow-xl whitespace-nowrap">
                        {content}
                    </div>
                </div>
            )}
        </div>
    );
}
