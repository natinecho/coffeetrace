"use client";

import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { RecentTransactionsProps, Destination } from "@/utils/types/types";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// Set up default icon for Leaflet markers
const defaultIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Component to update the map's center dynamically
function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const RecentTransactions = ({ id }: RecentTransactionsProps) => {
  const { data: session } = useSession();
  const [appdateDestinations, setAppdateDestinations] = useState<Destination[]>(
    []
  );
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    // Ensure this code only runs on the client-side
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get the location name
            const locationName = await getLocationName(latitude, longitude);
            const content = `User is currently at ${locationName}`;

            const destination: Destination = {
              time: new Date().toISOString(),
              content,
              color: "blue",
              latitude,
              longitude,
            };

            const response = await fetch(
              `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${id}/destinations`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session?.accessToken}`,
                },
                body: JSON.stringify(destination),
              }
            );

            if (response.ok) {
              setAppdateDestinations((prevDestinations) =>
                [...prevDestinations, destination].slice(-5)
              );
              setCurrentLocation({ latitude, longitude }); // Set the user's current location
            } else {
              console.error(
                "Failed to update destination",
                response.statusText
              );
            }
          } catch (error) {
            console.error("Error while updating destination:", error);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [id, session]);

  // Function to send updated destinations via POST request
  async function updateDestinations() {
    if (typeof window === "undefined" || !session?.accessToken) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Reverse geocoding to get the location name
            const locationName = await getLocationName(latitude, longitude);
            const content = `User is currently at ${locationName}`;

            const destination: Destination = {
              time: new Date().toISOString(),
              content,
              color: "blue",
              latitude,
              longitude,
            };

            const response = await fetch(
              `https://cofeetracebackend-2.onrender.com/api/v0/order/driver/${id}/destinations`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${session.accessToken}`,
                },
                body: JSON.stringify(destination),
              }
            );

            if (response.ok) {
              setAppdateDestinations((prevDestinations) =>
                [...prevDestinations, destination].slice(-5)
              );
              setCurrentLocation({ latitude, longitude }); // Set the user's current location
            } else {
              console.error(
                "Failed to update destination",
                response.statusText
              );
            }
          } catch (error) {
            console.error("Error while updating destination:", error);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  // Helper function to get the location name using reverse geocoding
  async function getLocationName(latitude: number, longitude: number) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        `Latitude: ${latitude}, Longitude: ${longitude}`
      );
    } catch (error) {
      console.error("Error fetching location name:", error);
      return `Latitude: ${latitude}, Longitude: ${longitude}`;
    }
  }

  // Automatically update destinations every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      updateDestinations();
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [id, session, appdateDestinations]);

  const mapCenter: [number, number] = currentLocation
    ? [currentLocation.latitude, currentLocation.longitude]
    : appdateDestinations.length > 0
    ? [appdateDestinations[0].latitude, appdateDestinations[0].longitude]
    : [0, 0]; // Ensure it's always [number, number]

  return (
    <DashboardCard title="Recent Destinations">
      {/* Display Leaflet Map with the last 5 destinations */}
      {appdateDestinations.length > 0 || currentLocation ? (
        <MapContainer
          center={mapCenter}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Recenter the map when current location changes */}
          {currentLocation && (
            <RecenterAutomatically
              lat={currentLocation.latitude}
              lng={currentLocation.longitude}
            />
          )}

          {/* Show destination markers */}
          {appdateDestinations.slice(-5).map((dest, index) => (
            <Marker
              key={index}
              position={[dest.latitude, dest.longitude]}
              icon={defaultIcon}
            >
              <Popup>
                <strong>{dest.content}</strong>
                <br />
                Time: {new Date(dest.time).toLocaleString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>No destinations available.</p>
      )}
    </DashboardCard>
  );
};

export default RecentTransactions;
