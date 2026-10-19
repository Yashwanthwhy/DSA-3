import { Vehicle, Shipment } from "./types";

export const vehicles:Vehicle[]=[
 {id:"TS09AB1234",type:"32 FT Multi-Axle Truck",driver:"Arjun Rao",status:"In Transit",location:"Nagpur, Maharashtra",route:"Hyderabad → Nagpur → Bhopal → Delhi",capacityT:15,loadT:12.3,volumeM3:60,usedVolumeM3:42,revenue:65000,cost:53900,lat:21.1458,lng:79.0882,nextStop:"Bhopal",destination:"Delhi",eta:"18:40",fuelEfficiency:4.1},
 {id:"AP28CD4567",type:"40 FT Container Truck",driver:"Vikram Singh",status:"Loading",location:"Hyderabad, Telangana",route:"Hyderabad → Bengaluru",capacityT:20,loadT:8.4,volumeM3:76,usedVolumeM3:31,nextStop:"Bengaluru",destination:"Bengaluru",eta:"Tomorrow 07:10",fuelEfficiency:3.7},
 {id:"KA01GH2345",type:"32 FT Trailer",driver:"Manoj Kumar",status:"Idle",location:"Bengaluru, Karnataka",route:"Bengaluru → Chennai",capacityT:16,loadT:5.2,volumeM3:64,usedVolumeM3:22,nextStop:"Chennai",destination:"Chennai",eta:"Tomorrow 12:30",fuelEfficiency:4.0},
 {id:"TS10EF7890",type:"24 FT Truck",driver:"Rahul Dev",status:"Maintenance",location:"Hyderabad Yard",route:"—",capacityT:10,loadT:0,volumeM3:40,usedVolumeM3:0,nextStop:"—",destination:"—",eta:"Service due",fuelEfficiency:4.5},
 {id:"MH12JK9087",type:"32 FT Multi-Axle Truck",driver:"Suresh Naik",status:"Delayed",location:"Bhopal, Madhya Pradesh",route:"Mumbai → Bhopal → Delhi",capacityT:18,loadT:14.1,volumeM3:68,usedVolumeM3:55,nextStop:"Delhi",destination:"Delhi",eta:"Tomorrow 03:20",fuelEfficiency:3.9},
 {id:"TN38LM4412",type:"40 FT Trailer",driver:"Prakash N",status:"At Stop",location:"Nagpur Hub",route:"Chennai → Nagpur → Delhi",capacityT:22,loadT:16.7,volumeM3:80,usedVolumeM3:58,nextStop:"Delhi",destination:"Delhi",eta:"Tomorrow 14:00",fuelEfficiency:3.6}
];

export const shipments:Shipment[]=[
 {id:"CR-24081",customer:"Metro Retail",origin:"Hyderabad",destination:"Delhi",weightT:7.2,volumeM3:24,revenue:36000,cost:28100,status:"In Transit",mode:"Multimodal",vehicle:"TS09AB1234"},
 {id:"CR-24082",customer:"Bharat Pharma",origin:"Nagpur",destination:"Bhopal",weightT:1.5,volumeM3:4,revenue:8000,cost:1850,status:"Booked",mode:"Truck",vehicle:"TS09AB1234"},
 {id:"CR-24083",customer:"Urban Build",origin:"Bengaluru",destination:"Chennai",weightT:4.8,volumeM3:18,revenue:21000,cost:15100,status:"In Transit",mode:"Truck",vehicle:"KA01GH2345"},
 {id:"CR-24084",customer:"DigiMart",origin:"Hyderabad",destination:"Delhi",weightT:0.8,volumeM3:2.5,revenue:14500,cost:9300,status:"At Risk",mode:"Flight"},
 {id:"CR-24085",customer:"FreshGrid",origin:"Mumbai",destination:"Delhi",weightT:8.4,volumeM3:30,revenue:42000,cost:31200,status:"Delivered",mode:"Train"}
];

export const monthly=[
 {month:"Mar",revenue:15.1,cost:12.8,profit:2.3},{month:"Apr",revenue:16.4,cost:13.1,profit:3.3},
 {month:"May",revenue:17.2,cost:13.9,profit:3.3},{month:"Jun",revenue:17.8,cost:14.2,profit:3.6},
 {month:"Jul",revenue:18.4,cost:14.7,profit:3.7},{month:"Aug",revenue:19.1,cost:15.0,profit:4.1}
];