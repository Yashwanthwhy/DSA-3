import {Menu, Bell, Search} from "lucide-react";
import {useState} from "react";
import Sidebar from "./Sidebar";
export default function Layout({children}:{children:React.ReactNode}){
 const [open,setOpen]=useState(false);
 return <div className="min-h-screen lg:flex"><Sidebar open={open} onClose={()=>setOpen(false)}/><main className="min-w-0 flex-1">
  <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-[#E5E5E1] bg-[#F7F7F5]/95 px-4 backdrop-blur lg:px-8">
   <div className="flex items-center gap-3"><button className="lg:hidden" onClick={()=>setOpen(true)}><Menu/></button><div className="hidden md:flex items-center gap-2 text-xs text-[#777]"><Search size={15}/>Search vehicles, routes, shipments...</div></div>
   <div className="flex items-center gap-3"><button className="relative rounded-lg p-2 hover:bg-white"><Bell size={18}/><span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#C92A1D]"/></button><div className="h-8 w-8 rounded-full bg-[#111] text-center text-xs font-bold leading-8 text-white">CR</div></div>
  </header><div className="p-4 md:p-6 lg:p-8">{children}</div>
 </main></div>
}