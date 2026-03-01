export function DataTable({ headers, rows, emptyMessage = 'Məlumat tapılmadı' }) {
    return (
        <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border bg-muted/50">
                        {headers.map((h, i) => <th key={i} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr><td colSpan={headers.length} className="px-4 py-8 text-center text-muted-foreground">{emptyMessage}</td></tr>
                    ) : rows.map((row, i) => (
                        <tr key={i} className="border-b border-border transition-colors last:border-0 hover:bg-muted/30">
                            {row.map((cell, j) => <td key={j} className="px-4 py-3">{cell}</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
