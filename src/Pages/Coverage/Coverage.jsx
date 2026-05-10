import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";


const Coverage = () => {
  const position = [23.8103, 90.4125];
    return (
      <div>
        <h1>We are available in 64 districts</h1>
        <input type="text" />
        <p>We deliver almost all over Bangladesh</p>
        {/* alskdfj */}
        <div className="w-full h-[500px] border-1">
          <MapContainer 
          center={position} 
          zoom={13} 
          scrollWheelZoom={false}
          className="h-[500px]"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    );
};

export default Coverage;