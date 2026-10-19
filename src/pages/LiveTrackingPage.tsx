import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Plane, Radio } from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { Vehicle } from '../types';
import { AIR_CARGO_FLIGHTS } from '../data/flights';
import { formatINR, formatWeight, formatDistance } from '../utils/formatters';

const getInitialFlightProgress = (flight: typeof AIR_CARGO_FLIGHTS[number]) => {
  const [start, end] = [flight.route[0], flight.route[flight.route.length - 1]];
  const latitudeDelta = end[0] - start[0];
  const longitudeDelta = end[1] - start[1];
  const positionLatitudeDelta = flight.position[0] - start[0];
  const positionLongitudeDelta = flight.position[1] - start[1];
  const denominator = latitudeDelta ** 2 + longitudeDelta ** 2;
  const progress = denominator === 0
    ? 0
    : ((positionLatitudeDelta * latitudeDelta + positionLongitudeDelta * longitudeDelta) / denominator) * 100;
  return Math.max(0, Math.min(100, progress));
};

const getFlightDistanceKm = (flight: typeof AIR_CARGO_FLIGHTS[number]) => {
  const [start, end] = [flight.route[0], flight.route[flight.route.length - 1]];
  const radians = Math.PI / 180;
  const deltaLatitude = (end[0] - start[0]) * radians;
  const deltaLongitude = (end[1] - start[1]) * radians;
  const haversine = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(start[0] * radians) * Math.cos(end[0] * radians) * Math.sin(deltaLongitude / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
};

// Custom SVG Leaflet marker icons
const createCustomIcon = (status: Vehicle['status'], isSelected: boolean, heading: number) => {
  const bgColor = status === 'In Transit' ? '#C92A1D' : status === 'Idle' ? '#111111' : '#E7E7E4';
  const ring = isSelected ? 'outline: 3px solid #FFD400; outline-offset: 2px;' : '';
  
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="
        background-color: ${bgColor};
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 11px;
        font-weight: bold;
        transform: rotate(${heading}deg);
        ${ring}
      ">
        ▲
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const createAirIcon = (isSelected: boolean) => L.divIcon({
  className: 'air-map-pin',
  html: `<div class="aircraft-marker ${isSelected ? 'is-selected' : ''}">✈</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

export const LiveTrackingPage: React.FC = () => {
  const { vehicles } = useLogistics();
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [selectedFlightId, setSelectedFlightId] = useState<string>(AIR_CARGO_FLIGHTS[0].id);
  const [lastFeedUpdate, setLastFeedUpdate] = useState(() => new Date());
  const [flightProgress, setFlightProgress] = useState<Record<string, number>>(() =>
    Object.fromEntries(AIR_CARGO_FLIGHTS.map((flight) => [flight.id, getInitialFlightProgress(flight)]))
  );

  useEffect(() => {
    setLastFeedUpdate(new Date());
  }, [vehicles]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlightProgress((previous) => Object.fromEntries(AIR_CARGO_FLIGHTS.map((flight) => {
        const current = previous[flight.id] ?? getInitialFlightProgress(flight);
        const speedKmph = Number.parseFloat(flight.speed);
        const progressPerSecond = (speedKmph / 3600 / getFlightDistanceKm(flight)) * 100;
        return [flight.id, Math.min(100, current + progressPerSecond)];
      })));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const liveFlights = AIR_CARGO_FLIGHTS.map((flight) => {
    const progress = flightProgress[flight.id] ?? getInitialFlightProgress(flight);
    const start = flight.route[0];
    const end = flight.route[flight.route.length - 1];
    return {
      ...flight,
      position: [
        start[0] + ((end[0] - start[0]) * progress) / 100,
        start[1] + ((end[1] - start[1]) * progress) / 100,
      ] as [number, number],
      progress: Math.round(progress),
      status: progress >= 100 ? 'Arrived' : flight.status,
    };
  });

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];
  const selectedFlight = liveFlights.find(f => f.id === selectedFlightId) || liveFlights[0];

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            SATELLITE TELEMETRY & GPS MESH
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Live Multimodal Radar
          </h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 font-bold text-sky-700"><Plane className="h-3 w-3" /> {AIR_CARGO_FLIGHTS.length} Air cargo flights</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-bold text-cr-text">Live simulated GPS feed · updates every second</span>
        </div>
      </div>

      {/* MAP & SIDEBAR CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[680px]">
        {/* LEAFLET MAP CONTAINER (8 cols) */}
        <div className="lg:col-span-8 cr-card rounded-lg overflow-hidden relative shadow-md">
          <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-slate-200 bg-white/95 px-3.5 py-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-slate-800">LIVE MAP</span>
              <span className="font-mono text-[10px] text-slate-500">
                Updated {new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' }).format(lastFeedUpdate)} IST
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-slate-600">
              <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3 text-cr-red" /> Road assets</span>
              <span className="inline-flex items-center gap-1"><Plane className="h-3 w-3 text-sky-600" /> Air cargo</span>
              <span className="w-full text-slate-500">Labels show city and state · select a marker for details</span>
              <span className="w-full text-slate-500">OpenStreetMap road layer · no API key required</span>
            </div>
          </div>
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            scrollWheelZoom={true}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              maxZoom={19}
            />

            {/* Render Vehicle Markers */}
            {vehicles.map((veh) => (
              <Marker
                key={veh.id}
                position={[veh.currentLocation.lat, veh.currentLocation.lng]}
                icon={createCustomIcon(veh.status, selectedVehicleId === veh.id, veh.currentLocation.heading)}
                eventHandlers={{
                  click: () => setSelectedVehicleId(veh.id)
                }}
              >
                <Popup>
                  <div className="p-2 font-mono text-xs space-y-1">
                    <strong className="text-cr-red block text-sm">{veh.regNumber}</strong>
                    <div>{veh.origin} → {veh.destination}</div>
                    <div>Speed: <strong>{veh.currentLocation.speedKmph} km/h</strong></div>
                    <div>Payload: {formatWeight(veh.currentWeightTons)}</div>
                  </div>
                </Popup>
                <Tooltip permanent direction="top" offset={[0, -10]} className="tracking-location-tooltip">
                  <span className="font-bold">{veh.currentLocation.city}</span>
                  <span className="text-slate-500">, {veh.currentLocation.state}</span>
                </Tooltip>
              </Marker>
            ))}

            {/* Air freight overlay */}
            {liveFlights.map((flight) => (
              <React.Fragment key={flight.id}>
                <Polyline positions={flight.route} color="#0ea5e9" weight={2} dashArray="4, 10" opacity={0.8} />
                <CircleMarker center={flight.route[0]} radius={4} pathOptions={{ color: '#0284c7', fillColor: '#e0f2fe', fillOpacity: 1, weight: 2 }}>
                  <Tooltip permanent direction="top" offset={[0, -4]} className="tracking-location-tooltip">
                    <span className="font-bold">{flight.origin}</span><span className="text-slate-500"> airport</span>
                  </Tooltip>
                </CircleMarker>
                <CircleMarker center={flight.route[flight.route.length - 1]} radius={4} pathOptions={{ color: '#0284c7', fillColor: '#e0f2fe', fillOpacity: 1, weight: 2 }}>
                  <Tooltip permanent direction="top" offset={[0, -4]} className="tracking-location-tooltip">
                    <span className="font-bold">{flight.destination}</span><span className="text-slate-500"> airport</span>
                  </Tooltip>
                </CircleMarker>
                <Marker position={flight.position} icon={createAirIcon(selectedFlightId === flight.id)} eventHandlers={{ click: () => setSelectedFlightId(flight.id) }}>
                  <Popup><div className="p-2 font-mono text-xs"><strong className="block text-sky-700">✈ {flight.id} · AIR CARGO</strong><div>{flight.flight} · {flight.tail}</div><div>{flight.origin} → {flight.destination}</div><div>{flight.altitude} · {flight.speed}</div></div></Popup>
                  <Tooltip permanent direction="top" offset={[0, -12]} className="tracking-location-tooltip">
                    <span className="font-bold">{flight.flight}</span><span className="text-slate-500"> · en route</span>
                  </Tooltip>
                </Marker>
              </React.Fragment>
            ))}

            {/* Route Polyline for Selected Vehicle */}
            {selectedVehicle && selectedVehicle.routeStops.length > 1 && (
              <Polyline
                positions={selectedVehicle.routeStops.map(s => [s.latitude, s.longitude])}
                color="#C92A1D"
                weight={3}
                dashArray="5, 8"
                opacity={0.8}
              />
            )}
            {selectedVehicle?.routeStops.map((stop) => {
              const isCurrentStop = stop.status === 'current';
              const stopColor = isCurrentStop ? '#C92A1D' : stop.status === 'completed' ? '#16a34a' : '#64748b';
              return (
                <CircleMarker
                  key={`${selectedVehicle.id}-${stop.city}`}
                  center={[stop.latitude, stop.longitude]}
                  radius={isCurrentStop ? 6 : 4}
                  pathOptions={{ color: '#ffffff', fillColor: stopColor, fillOpacity: 1, weight: 2 }}
                >
                  {!isCurrentStop && (
                    <Tooltip permanent direction="bottom" offset={[0, 5]} className="tracking-location-tooltip">
                      <span className="font-bold">{stop.city}</span><span className="text-slate-500"> · {stop.status}</span>
                    </Tooltip>
                  )}
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

        {/* VEHICLE INSPECTION SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          <div className="air-telemetry-panel rounded-xl p-5 text-white">
            <div className="flex items-start justify-between border-b border-white/15 pb-3">
              <div><span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-sky-200"><Radio className="h-3 w-3" /> AIR CARGO TRACKING</span><h3 className="mt-1 text-lg font-black">{selectedFlight.flight}</h3></div>
              <span className="rounded-full bg-emerald-400/15 px-2 py-1 text-[10px] font-bold text-emerald-300">{selectedFlight.status}</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-bold"><span>{selectedFlight.origin}</span><span className="h-px flex-1 bg-sky-300/40" /><Plane className="h-4 w-4 rotate-45 text-sky-300" /><span className="h-px flex-1 bg-sky-300/40" /><span>{selectedFlight.destination}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center font-mono"><div className="rounded-lg bg-white/10 p-2"><span className="block text-[9px] text-sky-200">ALTITUDE</span><strong className="text-xs">{selectedFlight.altitude}</strong></div><div className="rounded-lg bg-white/10 p-2"><span className="block text-[9px] text-sky-200">GROUND SPD</span><strong className="text-xs">{selectedFlight.speed}</strong></div><div className="rounded-lg bg-white/10 p-2"><span className="block text-[9px] text-sky-200">ETA</span><strong className="text-xs">{selectedFlight.eta}</strong></div></div>
            <div className="mt-4"><div className="mb-1 flex justify-between text-[10px] font-mono text-sky-100"><span>FLIGHT PROGRESS</span><span>{selectedFlight.progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-gradient-to-r from-sky-300 to-cyan-200" style={{ width: `${selectedFlight.progress}%` }} /></div></div>
          </div>
          {selectedVehicle && (
            <div className="cr-card rounded-lg p-5 space-y-5">
              <div className="flex items-start justify-between border-b border-cr-border pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-cr-muted uppercase">ACTIVE ASSET TELEMETRY</span>
                  <h3 className="font-black text-xl text-cr-text">{selectedVehicle.regNumber}</h3>
                  <p className="text-xs text-cr-muted font-mono">{selectedVehicle.makeModel}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900">
                  {selectedVehicle.status}
                </span>
              </div>

              {/* Real-Time Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">SPEED</span>
                  <strong className="text-base text-cr-text font-bold">{selectedVehicle.currentLocation.speedKmph} km/h</strong>
                </div>
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">CORRIDOR ETA</span>
                  <strong className="text-base text-cr-text font-bold">{selectedVehicle.eta}</strong>
                </div>
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">DISTANCE COVERED</span>
                  <strong className="text-cr-text font-bold">{formatDistance(selectedVehicle.distanceCoveredKm)}</strong>
                </div>
                <div className="p-2.5 rounded bg-[#F8F8F6] border border-cr-border">
                  <span className="text-[10px] text-cr-muted block">CURRENT PAYLOAD</span>
                  <strong className="text-cr-text font-bold">{formatWeight(selectedVehicle.currentWeightTons)}</strong>
                </div>
              </div>

              {/* DRIVER INFO */}
              <div className="p-3 rounded bg-white border border-cr-border text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-cr-muted">Driver:</span>
                  <strong className="text-cr-text">{selectedVehicle.driverName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-cr-muted">Contact:</span>
                  <strong className="text-cr-text">{selectedVehicle.driverPhone}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-cr-muted">Trip Margin:</span>
                  <strong className="text-emerald-700">+{formatINR(selectedVehicle.totalTripRevenue - selectedVehicle.totalTripCost)}</strong>
                </div>
              </div>

              {/* WAYPOINT PROGRESS */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-bold text-cr-muted uppercase">Route Checkpoints</h4>
                <div className="space-y-1.5 text-xs font-mono max-h-40 overflow-y-auto">
                  {selectedVehicle.routeStops.map((stop, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between p-2 rounded bg-[#F8F8F6]">
                      <span className="font-bold text-cr-text">{stop.city}</span>
                      <span className="text-[10px] text-cr-muted">{stop.status.toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FLEET ASSET LIST SELECTOR */}
          <div className="cr-card rounded-lg p-4 space-y-3">
            <h4 className="font-bold text-xs text-cr-text">All Tracked Vehicles</h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {vehicles.map(v => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVehicleId(v.id)}
                  className={`w-full text-left p-2 rounded text-xs font-mono flex items-center justify-between transition-colors ${
                    selectedVehicleId === v.id ? 'bg-slate-900 text-white' : 'hover:bg-cr-gray text-cr-text'
                  }`}
                >
                  <span className="font-bold">{v.regNumber}</span>
                  <span className="text-[10px] opacity-75">{v.origin} → {v.destination}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="cr-card rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between"><h4 className="font-bold text-xs text-cr-text">Air Cargo Manifest</h4><span className="text-[10px] font-mono text-sky-700">SATCOM LINKED</span></div>
            <div className="space-y-1.5">
              {liveFlights.map(f => <button key={f.id} onClick={() => setSelectedFlightId(f.id)} className={`w-full rounded-lg border p-2.5 text-left text-xs transition-all ${selectedFlightId === f.id ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-transparent hover:bg-cr-gray'}`}><div className="flex items-center justify-between"><span className="flex items-center gap-1.5 font-bold text-cr-text"><Plane className="h-3.5 w-3.5 text-sky-600" />{f.id}</span><span className="font-mono text-[10px] text-cr-muted">{f.load}</span></div><span className="mt-1 block font-mono text-[10px] text-cr-muted">{f.flight} · {f.tail} · {f.origin} → {f.destination}</span></button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
