// src/components/LayerToggle.jsx
const allLayers = ['NDVI', 'NDWI', 'BSI', 'EVI', 'Turbidity'];

function LayerToggle({ activeLayers, setActiveLayers }) {
  function toggleLayer(layer) {
    setActiveLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  }

  return (
    <div className="flex flex-wrap gap-3 my-2">
      {allLayers.map((layer) => (
        <button
          key={layer}
          onClick={() => toggleLayer(layer)}
          className={`px-4 py-1 rounded-full text-white font-semibold 
            ${activeLayers.includes(layer) ? 'bg-blue-600' : 'bg-gray-400'}`}
        >
          {layer}
        </button>
      ))}
    </div>
  );
}

export default LayerToggle;
