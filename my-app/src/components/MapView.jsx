import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import * as GeoTIFF from 'geotiff';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const CLASS_COLORS = {
  1: '#2ca02c',   // Mangrove forest
  2: '#8c564b',   // Bare Land
  3: '#1f77b4',   // Water
};

const CLASS_NAMES = {
  1: 'Mangrove forest',
  2: 'Bare Land',
  3: 'Water',
};

function RasterLayer({ year, onStatsReady }) {
  const map = useMap();
  const rasterLayerRef = useRef({});
  const lastLoadedYearRef = useRef(null);

  useEffect(() => {
    if (!year || year === lastLoadedYearRef.current) return;

    let cancelled = false;

    const loadRaster = async () => {
      // Remove previously added layer (if exists)
      if (rasterLayerRef.current.layer) {
        map.removeLayer(rasterLayerRef.current.layer);
        rasterLayerRef.current.layer = null;
      }

      try {
        const tiff = await GeoTIFF.fromUrl(`${import.meta.env.BASE_URL}data/lc_${year}.tif`);
        const image = await tiff.getImage();
        const rasters = await image.readRasters();
        const [values] = rasters;

        const width = image.getWidth();
        const height = image.getHeight();
        const [originX, originY] = image.getOrigin();
        let [resX, resY] = image.getResolution();

        if (resY < 0) resY = Math.abs(resY);

        console.log(`Loaded image ${year}: ${width}x${height}, res: ${resX}, ${resY}`);

        // Stats calculation
        const classCounts = {};
        values.forEach(v => {
          if (v === 0) return;
          classCounts[v] = (classCounts[v] || 0) + 1;
        });

        const totalPixels = width * height;
        const pixelArea = Math.abs(resX * resY);
        const stats = Object.entries(classCounts).map(([cls, count]) => ({
          class: parseInt(cls),
          area: (count * pixelArea / 1e6).toFixed(2),
          percent: ((count / totalPixels) * 100).toFixed(2),
        }));

        if (!cancelled) onStatsReady(stats);

        // Draw raster to canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        const imgData = ctx.createImageData(width, height);

        for (let i = 0; i < values.length; i++) {
          const val = values[i];
          const color = CLASS_COLORS[val] || '#000000';
          const [r, g, b] = hexToRgb(color);
          imgData.data[i * 4 + 0] = r;
          imgData.data[i * 4 + 1] = g;
          imgData.data[i * 4 + 2] = b;
          imgData.data[i * 4 + 3] = val === 0 ? 0 : 255;
        }

        ctx.putImageData(imgData, 0, 0);

        const topLeft = [originY, originX];
        const bottomRight = [originY - height * resY, originX + width * resX];
        const imageBounds = L.latLngBounds(bottomRight, topLeft);

        const imageOverlay = L.imageOverlay(canvas.toDataURL(), imageBounds, {
          opacity: 0.8,
        });

        if (!cancelled) {
          imageOverlay.addTo(map);
          rasterLayerRef.current.layer = imageOverlay;
          lastLoadedYearRef.current = year;

          // Fit map to image bounds only if not already contained
          if (!map.getBounds().contains(imageBounds)) {
            map.fitBounds(imageBounds, { padding: [20, 20], maxZoom: 16 });
          }
        }
      } catch (error) {
        console.error('Failed to load raster:', error);
      }
    };

    loadRaster();

    return () => {
      cancelled = true;
    };
  }, [year, map, onStatsReady]);

  return null;
}

function LegendControl({ year }) {
  const map = useMap();
  const legendRef = useRef(null);

  useEffect(() => {
    if (legendRef.current) {
      legendRef.current.remove();
      legendRef.current = null;
    }

    if (!year) return;

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'info legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.border = '1px solid #ccc';
      div.style.borderRadius = '4px';
      div.style.fontSize = '14px';
      div.innerHTML = `<strong>Legend</strong><br/>`;

      Object.entries(CLASS_COLORS).forEach(([key, color]) => {
        const k = parseInt(key);
        if (k === 4 && !(year === 2022 || year === 2025)) return;
        const label = CLASS_NAMES[k];
        div.innerHTML += `
          <div style="margin-bottom: 4px;">
            <span style="background:${color};width:12px;height:12px;display:inline-block;margin-right:6px;"></span>
            ${label}
          </div>`;
      });

      return div;
    };

    legend.addTo(map);
    legendRef.current = legend;

    return () => {
      if (legendRef.current) {
        legendRef.current.remove();
        legendRef.current = null;
      }
    };
  }, [map, year]);

  return null;
}

function MapView({ year, onStatsReady }) {
  return (
    <MapContainer
      className="h-[500px] w-full"
      center={[-1.0, 39.0]}
      zoom={10}
      scrollWheelZoom={true}
      maxZoom={18}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {year && (
        <>
          <RasterLayer year={year} onStatsReady={onStatsReady} />
          <LegendControl year={year} />
        </>
      )}
    </MapContainer>
  );
}

function hexToRgb(hex) {
  const stripped = hex.replace('#', '');
  const bigint = parseInt(stripped, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

export default MapView;
