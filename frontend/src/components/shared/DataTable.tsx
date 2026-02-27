import { useState, useMemo, type ReactNode } from 'react';
import { Search } from 'lucide-react';

interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchPlaceholder?: string;
    searchKeys?: (keyof T)[];
    filterSlot?: ReactNode;
    emptyState?: ReactNode;
    rowKey: (row: T) => string;
    onRowClick?: (row: T) => void;
    expandedRow?: string | null;
    renderExpanded?: (row: T) => ReactNode;
}

export function DataTable<T>({
    data,
    columns,
    searchPlaceholder = 'Search...',
    searchKeys = [],
    filterSlot,
    emptyState,
    rowKey,
    onRowClick,
    expandedRow,
    renderExpanded,
}: DataTableProps<T>) {
    const [search, setSearch] = useState('');

    const filtered = useMemo(() => {
        if (!search || searchKeys.length === 0) return data;
        const q = search.toLowerCase();
        return data.filter(row =>
            searchKeys.some(key => {
                const val = row[key];
                return typeof val === 'string' && val.toLowerCase().includes(q);
            })
        );
    }, [data, search, searchKeys]);

    return (
        <div className="space-y-4">
            {/* Search + Filters */}
            <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full h-9 pl-9 pr-4 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all"
                        />
                    </div>
                    {filterSlot}
                </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                {filtered.length === 0 ? (
                    emptyState || (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <p className="text-sm text-muted-foreground">No results found.</p>
                        </div>
                    )
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead>
                                <tr className="border-b border-border bg-muted/50">
                                    {columns.map(col => (
                                        <th key={col.key} className={`h-10 px-4 text-left align-middle font-medium text-muted-foreground text-xs uppercase tracking-wider ${col.className || ''}`}>
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(row => {
                                    const key = rowKey(row);
                                    const isExpanded = expandedRow === key;
                                    return (
                                        <tr
                                            key={key}
                                            className={`border-b border-border transition-colors hover:bg-muted/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                                            onClick={() => onRowClick?.(row)}
                                        >
                                            {columns.map(col => (
                                                <td key={col.key} className={`p-4 align-middle text-foreground ${col.className || ''}`}>
                                                    {col.render(row)}
                                                </td>
                                            ))}
                                            {isExpanded && renderExpanded && (
                                                <td colSpan={columns.length} className="bg-muted/50 px-4 py-3">
                                                    {renderExpanded(row)}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
