export default function KPI({label,value,sub,accent=false}:{label:string;value:string;sub?:string;accent?:boolean}){
 return <div className={`card kpi-glow p-5 ${accent?"border-[#e4dca8]":""}`}>
  <div className="flex items-center justify-between">
   <span className="text-xs font-bold uppercase tracking-[.12em] text-[#777]">{label}</span>
   {accent&&<span className="yellow-dot"/>}
  </div>
  <div className="mt-3 text-2xl font-extrabold tracking-[-.05em] md:text-3xl">{value}</div>
  {sub&&<div className="mt-1 text-xs text-[#777]">{sub}</div>}
 </div>
}