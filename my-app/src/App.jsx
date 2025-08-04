import { useState } from 'react';
import MapView from './components/MapView';
import YearSelector from './components/YearSelector';
import StatsTable from './components/StatsTable';
import AreaChart from './components/AreaChart';

const years = [2007, 2012, 2017, 2022, 2025];

function App() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [statsByYear, setStatsByYear] = useState({});

  // Handle stats from MapView and store by year
  const handleStatsReady = (yearStats) => {
    setStatsByYear((prevStats) => ({
      ...prevStats,
      [selectedYear]: yearStats,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold mb-4">Mangrove & Creek Rehabilitation Dashboard</h1>

      <YearSelector
        years={years}
        selectedYear={selectedYear}
        onSelect={setSelectedYear}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <MapView year={selectedYear} onStatsReady={handleStatsReady} />
        <StatsTable stats={statsByYear[selectedYear]} />
      </div>

      <div className="mt-6">
        <AreaChart statsByYear={statsByYear} />
      </div>
    </div>
  );
}

export default App;
