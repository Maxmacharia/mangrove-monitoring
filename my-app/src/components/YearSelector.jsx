function YearSelector({ years, selectedYear, onSelect }) {
  return (
    <div className="flex space-x-2">
      {years.map(year => (
        <button
          key={year}
          onClick={() => onSelect(year)}
          className={`px-4 py-2 rounded-lg ${
            year === selectedYear ? 'bg-blue-600 text-white' : 'bg-white border'
          }`}
        >
          {year}
        </button>
      ))}
    </div>
  );
}

export default YearSelector;
