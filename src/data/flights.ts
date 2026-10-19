export interface AirCargoFlight {
  id: string;
  flight: string;
  tail: string;
  origin: string;
  destination: string;
  position: [number, number];
  route: [number, number][];
  altitude: string;
  speed: string;
  eta: string;
  load: string;
  status: string;
  progress: number;
}

export const AIR_CARGO_FLIGHTS: AirCargoFlight[] = [
  { id: 'AIR-CRX-721', flight: 'CRX 721', tail: 'VT-CR7', origin: 'Hyderabad', destination: 'Delhi', position: [23.18, 77.72], route: [[17.385, 78.4867], [28.6139, 77.209]], altitude: '32,000 ft', speed: '814 km/h', eta: '13:40 IST', load: '7.8 / 10.0 T', status: 'On Schedule', progress: 58 },
  { id: 'AIR-CRX-408', flight: 'CRX 408', tail: 'VT-CR4', origin: 'Mumbai', destination: 'Bengaluru', position: [16.34, 75.31], route: [[19.076, 72.8777], [12.9716, 77.5946]], altitude: '28,000 ft', speed: '776 km/h', eta: '14:10 IST', load: '4.2 / 8.0 T', status: 'On Schedule', progress: 46 },
  { id: 'AIR-CRX-116', flight: 'CRX 116', tail: 'VT-CR1', origin: 'Chennai', destination: 'Kolkata', position: [17.24, 82.89], route: [[13.0827, 80.2707], [22.5726, 88.3639]], altitude: '34,000 ft', speed: '829 km/h', eta: '15:25 IST', load: '6.1 / 9.0 T', status: 'Priority', progress: 43 },
];
