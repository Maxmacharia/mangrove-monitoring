import { useDropzone } from 'react-dropzone';
import { useCallback, useState } from 'react';
import { GeoJSON } from 'react-leaflet';

const GeoJsonUploader = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const json = JSON.parse(reader.result);
      setGeoJsonData(json);
    };
    reader.readAsText(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/geo+json': ['.geojson', '.json'] },
    onDrop
  });

  return (
    <div className="p-4 border-dashed border-2 border-blue-500 rounded-md mb-4">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />
        <p>📁 Drag and drop your GeoJSON file here, or click to upload</p>
      </div>

      {geoJsonData && <GeoJSON data={geoJsonData} />}
    </div>
  );
};

export default GeoJsonUploader;
