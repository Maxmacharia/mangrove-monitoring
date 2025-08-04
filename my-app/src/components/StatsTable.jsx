const CLASS_LABELS = {
  1: 'Mangrove Forest',
  2: 'Bare Land',
  3: 'Water',
  4: 'Prosopis',
};

function StatsTable({ stats }) {
  if (!stats) return <div className="text-gray-500">Click year of preference to visualize</div>;

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 p-4 bg-white shadow-md">
      <h2 className="text-lg font-semibold mb-2">Coverage Table</h2>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Class</th>
            <th className="p-2">Percentage (%)</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(({ class: cls, percent }) => (
            <tr key={cls} className="border-t">
              <td className="p-2">{CLASS_LABELS[cls] || `Class ${cls}`}</td>
              <td className="p-2">
                {isNaN(percent) ? 'N/A' : Number(percent).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StatsTable;
