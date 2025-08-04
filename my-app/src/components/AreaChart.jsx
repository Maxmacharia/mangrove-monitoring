import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CLASS_LABELS = {
  1: 'Mangrove Forest',
  2: 'Bare Land',
  3: 'Water',
  4: 'Prosopis',
};

const CLASS_COLORS = {
  'Mangrove Forest': '#2ca02c',
  'Bare Land': '#8c564b',
  'Water': '#1f77b4',
  'Prosopis': '#d62728',
};

function AreaChart({ statsByYear }) {
  if (!statsByYear || Object.keys(statsByYear).length === 0) {
    return null;
  }

  // Pivot data: { year: 2025, Forest: 23.4, Water: 12.1, ... }
  const chartData = Object.entries(statsByYear).map(([year, stats]) => {
    const yearEntry = { year };

    stats.forEach(({ class: cls, percent }) => {
      const label = CLASS_LABELS[cls] || `Class ${cls}`;
      yearEntry[label] = Number(percent);
    });

    return yearEntry;
  });

  const uniqueClasses = Array.from(
    new Set(
      Object.values(statsByYear)
        .flat()
        .map((s) => CLASS_LABELS[s.class] || `Class ${s.class}`)
    )
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Land Cover Change (Percent)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <XAxis dataKey="year" />
          <YAxis label={{ value: 'Percent (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {uniqueClasses.map((className) => (
            <Bar
              key={className}
              dataKey={className}
              name={className}
              fill={CLASS_COLORS[className] || '#8884d8'}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AreaChart;
