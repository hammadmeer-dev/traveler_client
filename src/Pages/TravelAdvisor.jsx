import { useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineTravelExplore } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Header from "../Components/Header";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import MoreInfoModal from "../Components/MoreInfoModel";
import Loader from "../Components/Loader";
import { toast } from "react-hot-toast";
const ADVISOR_APP_SERVER_BASE_URL = import.meta.env
  .VITE_TRAVEL_ADVISOR_BASE_URL;
const TravelAdvisor = () => {
  const [province, setProvince] = useState("");
  const [destinationType, setDestinationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null); // Track the selected place

  const openModal = (place) => {
    setSelectedPlace(place);
  };

  const closeModal = () => {
    setSelectedPlace(null);
  };
  const provinces = [
    "Punjab",
    "Sindh",
    "Khyber Pakhtunkhwa",
    "Balochistan",
    "Gilgit−Baltistan",
    "Islamabad",
    "Azad Kashmir",
  ];

  const destinationTypes = [
    "Mountainous",
    "Valley",
    "Lake",
    "Waterfall",
    "Coastal",
    "Hill Station",
    "Mosque",
    "Fort",
    "Temple",
    "Museum",
    "National Park",
    "Monument",
    "Resort",
    "Desert",
    "Mine",
  ];

  const handleSubmit = async () => {
  setLoading(true);
  try {
    const response = await fetch(
      `${ADVISOR_APP_SERVER_BASE_URL}/recommend?district=${encodeURIComponent(
        province
      )}&category=${encodeURIComponent(destinationType)}`
    );

    const data = await response.json();

    // Handle API-specific error responses
    if (!response.ok) {
      if (data.error === "Invalid district") {
        toast.error("Invalid district");
      } else if (data.error === "Invalid category") {
        toast.error("Invalid category");
      } else if (data.message === "No recommendations found") {
        toast.error("No recommendations found");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      return; // Exit early after showing error
    }

    setResults(data); // Success - set the results

  } catch (error) {
    // Network error or unexpected error
    toast.error("Something went wrong. Please try again.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Header />
      <div
        className="max-h-max min-h-auto flex flex-col items-center justify-center bg-no-repeat bg-contain bg-center text-white mt-6 "
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/djiqzvcev/image/upload/v1751670820/Lovepik_com-380060060-travel-map-illustration-hand-painted-colorful-color_tuyiqw.png')",
        }}
      >
        <div className=" fixed w-full h-full top-0 left-0"></div>

        <h1 className="text-4xl font-bold mb-2 relative z-10 text-bgPrimary">
          Discover Your Next Adventure
        </h1>
        <p className="mb-6 text-lg relative z-10 text-bgPrimary">
          Select your province and destination type, and let us suggest the best
          travel spots for you!
        </p>

        <div className="relative z-10 bg-black bg-opacity-40 backdrop-blur-lg p-6 rounded-2xl shadow-lg w-96">
          <div className="mb-4">
            <label className="block text-lg mb-2">Province</label>
            <div className="flex items-center bg-white p-2 rounded-lg">
              <FaMapMarkerAlt className="text-gray-700 mr-2" />
              <select
                className="w-full bg-transparent text-black focus:outline-none"
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-lg mb-2">Destination Type</label>
            <div className="flex items-center bg-white p-2 rounded-lg">
              <MdOutlineTravelExplore className="text-gray-700 mr-2" />
              <select
                className="w-full bg-transparent text-black focus:outline-none"
                onChange={(e) => setDestinationType(e.target.value)}
              >
                <option value="">Select Type</option>
                {destinationTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-400 to-green-400 text-white p-3 rounded-lg mt-4 hover:opacity-80 transition"
          >
            Find My Destination
          </button>
        </div>


        {selectedPlace && (
          <MoreInfoModal place={selectedPlace} onClose={closeModal} />
        )}
      </div>
      <div
        className="flex flex-col items-center justify-center bg-no-repeat bg-contain bg-center text-white mt-6"
      >
        {loading && <Loader />}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 mb-3">
        {results.map((place, index) => (
          <div
            key={index}
            className="bg-black bg-opacity-40 p-4 rounded-lg backdrop-blur-lg shadow-lg w-80 relative"
          >
            {/* Map positioned on top */}
            <div className="relative h-40 w-full">
              <MapContainer
                center={[place.latitude, place.longitude]}
                zoom={13}
                style={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[place.latitude, place.longitude]}>
                  <Popup>{place._key}</Popup>
                </Marker>
              </MapContainer>
            </div>
            {/* Place title */}
            <h2 className="text-xl font-bold mt-2">{place._key}</h2>
            <p className="text-sm mt-1 truncate">{place.Desc}</p>
            <p className="text-xs text-gray-300 mt-1">
              {place.district} • Lat: {place.latitude.toFixed(3)} • Lng:{" "}
              {place.longitude.toFixed(3)}
            </p>
            <button
              className="mt-2 text-blue-300 hover:underline"
              onClick={() => openModal(place)}
            >
              More Info
            </button>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default TravelAdvisor;
