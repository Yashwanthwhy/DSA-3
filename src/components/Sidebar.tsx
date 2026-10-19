import {NavLink} from "react-router-dom";
import {BarChart3, Boxes, CarFront, CircleDollarSign, FileText, Gauge, LayoutDashboard, Map, MapPinned, Package, Settings2, Truck, Users, Wrench, X} from "lucide-react";
const groups=[
 {label:"Overview",items:[["/","Dashboard",LayoutDashboard]]},
 {label:"Operations",items:[["/routes","Route Optimizer",Map],["/shipments","Shipments",Package],["/capacity","Capacity",Gauge]]},
 {label:"Fleet",items:[["/fleet","Vehicles",Truck],["/tracking","Live Tracking",MapPinned],["/drivers","Drivers",Users],["/maintenance","Maintenance",Wrench]]},
 {label:"Finance",items:[["/expenses","Expenses",CircleDollarSign],["/profitability","Profitability",BarChart3],["/investor","Investor Dashboard",Boxes]]},
 {label:"Analytics",items:[["/reports","Reports",FileText]]},
 {label:"Company",items:[["/about","About CargoRoute",Settings2]]}
] as const;
export default function Sidebar({open,onClose}:{open:boolean;onClose:()=>void}){
 return <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[270px] shrink-0 border-r border-[#E5E5E1] bg-white transition-transform ${open?"translate-x-0":"-translate-x-full lg:translate-x-0"}`}>
  <div className="flex h-full flex-col p-5">
   <div className="flex items-center justify-between pb-7">
    <NavLink to="/" className="text-xl font-extrabold tracking-[-.04em]">CARGO<span className="text-[#C92A1D]">ROUTE</span></NavLink>
    <button onClick={onClose} className="lg:hidden"><X size={20}/></button>
   </div>
   <div className="mb-5 rounded-xl bg-[#F7F7F5] p-3 text-xs"><span className="font-bold">DEMO ENVIRONMENT</span><div className="mt-1 text-[#6B6B6B]">Frontend simulation · Mock data</div></div>
   <nav className="space-y-5 overflow-auto pr-1">
    {groups.map(g=><div key={g.label}><div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8A8A86]">{g.label}</div>
      <div className="space-y-1">{g.items.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"} onClick={onClose} className={({isActive})=>`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isActive?"bg-[#111] text-white":"text-[#565652] hover:bg-[#F7F7F5] hover:text-[#111]"}`}><Icon size={17}/>{label}</NavLink>)}</div>
    </div>)}
   </nav>
   <div className="mt-auto border-t pt-4 text-xs text-[#777]">CargoRoute v1.0 · Simulation</div>
  </div>
 </aside>
}