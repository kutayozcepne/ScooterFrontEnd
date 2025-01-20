import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import "./userpage.css";
import LogoutButton from '../components/logoutbutton';

mapboxgl.accessToken = "pk.eyJ1Ijoia3V0YXlvemNlcG5lIiwiYSI6ImNtNHF3ZDF4ODB6bngya3Mzc2ZkcjFoMDIifQ.VCcuS6F-0KVFhFQPIxI-WA";

const UserPage = () => {
  const [scooters, setScooters] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedScooter, setSelectedScooter] = useState(null);
  const [timer, setTimer] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch scooters from API
  useEffect(() => {
    const fetchScooters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/scooters/');
        const filteredScooters = response.data.filter((scooter) => scooter.battery_status >= 20);
        setScooters(filteredScooters);
      } catch (error) {
        console.error('Error fetching scooters:', error);
      }
    };

    fetchScooters();
  }, []);

  // Initialize map
  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: 'map',
        style: "mapbox://styles/kutayozcepne/cm50pdlkh009d01sa697ldu7q",
        center: [32.8541, 39.9208], // Ankara
        zoom: 12,
      });

      setMap(mapInstance);
    };

    initializeMap();
    return () => map && map.remove();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (map && scooters.length > 0) {
      // Clear existing markers first
      const markers = document.getElementsByClassName('mapboxgl-marker');
      while(markers.length > 0) {
        markers[0].remove();
      }

      // Add new markers
      scooters.forEach((scooter) => {
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(
            `<h4>${scooter.unique_name}</h4><p>Battery: ${scooter.battery_status}%</p>`
          );

        const marker = new mapboxgl.Marker()
          .setLngLat([scooter.longitude, scooter.latitude])
          .setPopup(popup)
          .addTo(map);

        // Store popup reference on marker element for later updates
        marker.getElement()._popup = popup;
        marker.getElement()._scooterId = scooter.id;

        marker.getElement().addEventListener('click', () => {
          setSelectedScooter(scooter);
        });
      });
    }
  }, [map, scooters]);

  const handleStartRide = () => {
    if (!selectedScooter) {
      alert('Please select a scooter on the map to start a ride!');
      return;
    }

    setTimer(selectedScooter.battery_status);
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }

    if (timer === 0 && selectedScooter) {
      handleStopRide();
    }
  }, [timer]);

  const handleStopRide = async () => {
    if (!selectedScooter) return;

    try {
      await axios.put(`http://localhost:5000/scooters/${selectedScooter.id}`, {
        battery_status: timer,
      });

      if(timer >= 20){
        const markers = document.getElementsByClassName('mapboxgl-marker');
        Array.from(markers).forEach(markerElement => {
          if (markerElement._scooterId === selectedScooter.id && markerElement._popup) {
            markerElement._popup.setHTML(
              `<h4>${selectedScooter.unique_name}</h4><p>Battery: ${timer}%</p>`
            );
          }
        });
      }
      else {
        const markers = document.getElementsByClassName('mapboxgl-marker');
        Array.from(markers).forEach(markerElement => {
          if (markerElement._scooterId === selectedScooter.id) {
            if (markerElement._popup) {
              markerElement._popup.remove();
            }
            markerElement.remove();
          }
        });
      }

      const response = await axios.get('http://localhost:5000/scooters/');
      const filteredScooters = response.data.filter((scooter) => scooter.battery_status >= 20);
      setScooters(filteredScooters);

      setTimer(null);
      setSelectedScooter(null);
    } catch (error) {
      console.error('Error updating scooter battery:', error);
    }
  };

  return (
    <div id="map" style={{height: window.innerHeight-0.5, width: window.innerWidth-0.05}}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        =
      </button>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button onClick={() => (window.location.href = '/')}>Homepage</button>
        <LogoutButton/>
        <button onClick={handleStartRide}>Start Ride</button>
          {timer !== null && (
              <div className="ride-info">
                <h4>Ride Timer: {timer}s</h4>
                <button onClick={handleStopRide}>Stop Ride</button>
              </div>
          )}
      </div>
    </div>
  );
};

export default UserPage;
