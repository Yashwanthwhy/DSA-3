export type VehicleStatus = "In Transit"|"Loading"|"Idle"|"Delayed"|"Maintenance"|"At Stop"|"Offline";
export type Vehicle = {
  id:string; type:string; driver:string; status:VehicleStatus; location:string; route:string;
  capacityT:number; loadT:number; volumeM3:number; usedVolumeM3:number; revenue:number; cost:number;
  lat:number; lng:number; nextStop:string; destination:string; eta:string; fuelEfficiency:number;
};
export type Shipment = {
  id:string; customer:string; origin:string; destination:string; weightT:number; volumeM3:number;
  revenue:number; cost:number; status:"Booked"|"In Transit"|"Delivered"|"At Risk";
  mode:"Truck"|"Train"|"Flight"|"Multimodal"; vehicle?:string;
};