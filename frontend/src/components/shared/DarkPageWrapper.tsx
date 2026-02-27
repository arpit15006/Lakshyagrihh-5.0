import { Component, type ReactNode, type ErrorInfo } from 'react';
import '../../styles/design-tokens.css';

/* ── Error Boundary ──────────────────────────────────────── */
interface ErrorBoundaryState { hasError: boolean; error?: Error; }

class FleetErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[FleetFlow Error]', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                    <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                        <span className="text-2xl">⚠️</span>
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-100 mb-2">Something went wrong</h2>
                    <p className="text-sm text-zinc-400 max-w-sm mb-4">{this.state.error?.message || 'An unexpected error occurred.'}</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

/* ── Dark Page Wrapper ───────────────────────────────────── */
interface DarkPageWrapperProps {
    children: ReactNode;
}

export function DarkPageWrapper({ children }: DarkPageWrapperProps) {
    return (
        <div className="min-h-full -m-6 md:-m-8 p-6 md:p-8">
            <FleetErrorBoundary>
                {children}
            </FleetErrorBoundary>
        </div>
    );
}
