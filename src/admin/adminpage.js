import React, { useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import "./adminpage.css";

mapboxgl.accessToken = "pk.eyJ1Ijoia3V0YXlvemNlcG5lIiwiYSI6ImNtNHF3ZDF4ODB6bngya3Mzc2ZkcjFoMDIifQ.VCcuS6F-0KVFhFQPIxI-WA";

const AdminPage = () => {
  const [map, setMap] = useState(null);
  const [scooterData, setScooterData] = useState({
    latitude: '',
    longitude: '',
    unique_name: '',
    battery_status: 100,
  });
  const [scooters, setScooters] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const mapContainerRef = React.useRef(null);

  React.useEffect(() => {
    const fetchScooters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scooters/');
        const filteredScooters = response.data.filter((scooter) => scooter.battery_status >= 0);
        setScooters(filteredScooters);
      } catch (error) {
        console.error('Error fetching scooters:', error);
      }
    };

    fetchScooters();
  }, []);

  React.useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/kutayozcepne/cm50pdlkh009d01sa697ldu7q",
      center: [32.85, 39.92], // Ankara
      zoom: 12,
    });

    mapInstance.on('load', () => setMap(mapInstance));

    return () => mapInstance.remove();
  }, []);

  React.useEffect(() => {
    if (map && scooters.length > 0) {
      scooters.forEach((scooter) => {
        const marker = new mapboxgl.Marker()
          .setLngLat([scooter.longitude, scooter.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h4>${scooter.unique_name}</h4><p>Battery: ${scooter.battery_status}%</p>`
            )
          )
          .addTo(map);
        });
    }
  }, [map, scooters]);

  const handleMapClick = (e) => {
    const { lng, lat } = e.lngLat;
    setScooterData({ ...scooterData, latitude: lat, longitude: lng });
  };

  React.useEffect(() => {
    if (map) {
      map.on('click', handleMapClick);
    }
  }, [map]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScooterData({ ...scooterData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/scooters/add', scooterData);
      alert(`Scooter added: ${response.data.unique_name}`);
  
      // Add marker to the map
      new mapboxgl.Marker()
        .setLngLat([scooterData.longitude, scooterData.latitude])
        .addTo(map);
    } catch (err) {
      console.error(err);
      alert('Error adding scooter');
    }
  };

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };
  

  return (
      <div className="admin-container">
        <div className="map-container" id="map">
          <button className="expand-button" onClick={toggleExpansion}>
            {isExpanded ? 'Close' : 'Add Scooter'}
          </button>
        </div>
        <div className={`control-panel ${isExpanded ? 'expanded' : ''}`}>
          <form className="scooter-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="unique_name"
                placeholder="Unique Name"
                value={scooterData.unique_name}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="battery_status"
                placeholder="Battery Status (0-100)"
                value={scooterData.battery_status}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="latitude"
                placeholder="Latitude (set by clicking the map)"
                value={scooterData.latitude}
                readOnly
            />
            <input
                type="text"
                name="longitude"
                placeholder="Longitude (set by clicking the map)"
                value={scooterData.longitude}
                readOnly
            />
            <button type="submit">Add Scooter</button>
          </form>
        </div>
      </div>
  );
};

export default AdminPage;
