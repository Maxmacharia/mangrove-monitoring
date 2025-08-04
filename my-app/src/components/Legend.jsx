// src/components/Legend.jsx
function Legend() {
  const legend = {
    NDVI: 'green',
    NDWI: 'blue',
    BSI: 'orange',
    EVI: 'darkgreen',
    Turbidity: 'purple',
  };

  return (
    <div className="absolute bottom-4 left-4 bg-white p-3 rounded-md shadow-md z-10">
      <h4 className="font-bold mb-1">Legend</h4>
      <ul>
        {Object.entries(legend).map(([layer, color]) => (
          <li key={layer} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full`} style={{ backgroundColor: color }}></div>
            <span>{layer}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Legend;
