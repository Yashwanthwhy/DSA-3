import React, { useState } from 'react';
import { 
  Package, Search, Filter, Plus, ArrowRight, X, 
  CheckCircle2, Clock, AlertTriangle, Truck, Train, Plane, ShieldCheck, XCircle, ScanLine
} from 'lucide-react';
import { useLogistics } from '../context/LogisticsContext';
import { Shipment, GoodsType, TransportMode } from '../types';
import { formatINR, formatWeight, formatVolume } from '../utils/formatters';

export const ShipmentsPage: React.FC = () => {
  const { shipments, createShipment, approveShipment, rejectShipment } = useLogistics();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Shipment form state
  const [newCust, setNewCust] = useState('');
  const [newOrigin, setNewOrigin] = useState('Hyderabad');
  const [newDest, setNewDest] = useState('Delhi');
  const [newWeight, setNewWeight] = useState(6.0);
  const [newVol, setNewVol] = useState(24.0);
  const [newRevenue, setNewRevenue] = useState(48000);
  const [newGoodsType, setNewGoodsType] = useState<GoodsType>('Electronics');
  const [newMode, setNewMode] = useState<TransportMode>('Multimodal');

  const filteredShipments = shipments.filter(s => {
    const matchesSearch = s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });
  const approvalQueue = shipments.filter(s => s.status === 'Pending Approval');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createShipment({
      customerName: newCust || 'Enterprise Shipper',
      origin: newOrigin,
      destination: newDest,
      weightTons: newWeight,
      volumeM3: newVol,
      revenue: newRevenue,
      goodsType: newGoodsType,
      transportMode: newMode
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-cr-border pb-5">
        <div>
          <span className="text-[11px] font-mono font-bold tracking-widest text-cr-muted uppercase">
            CONSOLIDATED CONSIGNMENT LEDGER
          </span>
          <h1 className="text-3xl font-extrabold text-cr-text tracking-tight mt-0.5">
            Shipment Management & P&L
          </h1>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 rounded bg-cr-red hover:bg-cr-red-dark text-white font-bold text-xs tracking-tight shadow-sm flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Shipment</span>
        </button>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-cr-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search tracking ID, client, origin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-cr-border rounded-md pl-9 pr-3 py-2 text-xs font-mono text-cr-text focus:outline-none focus:border-cr-red"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'Pending Approval', 'In Transit', 'Pending Pickup', 'Delivered', 'Delayed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === status
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-cr-border text-cr-muted hover:text-cr-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* PRE-DISPATCH APPROVAL CONTROL TOWER */}
      {approvalQueue.length > 0 && (
        <section className="approval-control rounded-2xl p-5">
          <div className="flex flex-col gap-4 border-b border-white/15 pb-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/15 text-amber-200"><ShieldCheck className="h-5 w-5" /></div><div><span className="text-[10px] font-mono font-bold tracking-[0.18em] text-amber-200">PRE-DISPATCH CONTROL TOWER</span><h2 className="mt-0.5 text-lg font-extrabold text-white">{approvalQueue.length} consignments await release authorization</h2><p className="mt-1 text-xs text-slate-300">Capacity, margin, and service-level checks are ready for operator sign-off.</p></div></div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-mono text-slate-200"><ScanLine className="mr-1.5 inline h-3.5 w-3.5 text-cyan-300" /> Risk engine: <strong className="text-emerald-300">all checks online</strong></div>
          </div>
          <div className="mt-4 grid gap-3 xl:grid-cols-2">
            {approvalQueue.map(s => <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><div className="flex items-center gap-2"><span className="font-mono text-xs font-bold text-sky-200">{s.trackingNumber}</span><span className="rounded bg-rose-400/15 px-1.5 py-0.5 text-[9px] font-bold text-rose-200">{s.priority}</span></div><h3 className="mt-1 text-sm font-bold text-white">{s.origin} → {s.destination}</h3><p className="mt-1 text-[11px] text-slate-300">{s.customerCompany} · {formatWeight(s.weightTons)} · {s.transportMode}</p></div><div className="text-left sm:text-right"><strong className="block text-sm text-emerald-300">+{formatINR(s.profit)}</strong><span className="text-[10px] font-mono text-slate-400">{s.profitMargin}% margin</span></div></div><div className="mt-3 flex gap-2"><button onClick={() => approveShipment(s.id)} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-400 px-3 py-2 text-[11px] font-bold text-slate-950 transition hover:bg-emerald-300"><CheckCircle2 className="h-3.5 w-3.5" /> Approve & allocate</button><button onClick={() => rejectShipment(s.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-2 text-[11px] font-bold text-slate-200 transition hover:bg-white/10"><XCircle className="h-3.5 w-3.5" /> Decline</button></div></div>)}
          </div>
        </section>
      )}

      {/* SHIPMENTS TABLE */}
      <div className="cr-card rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#F8F8F6] border-b border-cr-border text-cr-muted uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Tracking #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Mode / Asset identity</th>
                <th className="py-3 px-4">Payload</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Profit / Margin</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border bg-white">
              {filteredShipments.map((s) => (
                <tr key={s.id} className="hover:bg-cr-gray/30 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-cr-text">
                    <span className="text-cr-red">{s.trackingNumber}</span>
                    {s.isIntermediateLoad && (
                      <span className="block text-[9px] font-mono text-amber-700 font-semibold">
                        ★ Intermediate Load
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-cr-text block">{s.customerName}</span>
                    <span className="text-[10px] text-cr-muted">{s.customerCompany}</span>
                  </td>
                  <td className="py-3.5 px-4 text-cr-muted">
                    {s.origin} → {s.destination}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-cr-text">
                      {s.transportMode === 'Train' ? <Train className="w-3.5 h-3.5 text-emerald-700" /> :
                       s.transportMode === 'Flight' ? <Plane className="w-3.5 h-3.5 text-blue-700" /> :
                       <Truck className="w-3.5 h-3.5 text-cr-red" />}
                      {s.transportMode}
                    </span>
                    <span className="mt-1 block text-[10px] font-mono font-bold text-slate-700">{s.assignedAssetId || s.assignedVehicleReg || 'Unassigned'}</span>
                    <span className="block text-[9px] text-cr-muted">{s.assignedAssetLabel}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <strong>{formatWeight(s.weightTons)}</strong> • {formatVolume(s.volumeM3)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      s.status === 'Pending Approval' ? 'bg-sky-50 text-sky-800 border border-sky-200' :
                      s.status === 'In Transit' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      s.status === 'Delayed' || s.status === 'Rejected' ? 'bg-rose-50 text-rose-800 border border-rose-200' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-cr-text">
                    {formatINR(s.revenue)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-extrabold text-emerald-700 block">+{formatINR(s.profit)}</span>
                    <span className="text-[10px] text-cr-muted font-semibold">{s.profitMargin}%</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setSelectedShipment(s)}
                      className="px-2 py-1 rounded bg-[#EFEFEA] hover:bg-cr-gray text-cr-text text-[11px] font-bold transition-colors cursor-pointer"
                    >
                      Unit P&L
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedShipment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-5 border border-cr-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-cr-border pb-3">
              <div>
                <span className="text-[10px] font-mono text-cr-muted uppercase font-bold">SHIPMENT FINANCIAL AUDIT</span>
                <h3 className="font-extrabold text-lg text-cr-text">{selectedShipment.trackingNumber}</h3>
              </div>
              <button onClick={() => setSelectedShipment(null)} className="p-1 rounded hover:bg-cr-gray text-cr-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-cr-border">
                <span className="text-cr-muted">Customer Name:</span>
                <strong>{selectedShipment.customerName} ({selectedShipment.customerCompany})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border">
                <span className="text-cr-muted">Corridor:</span>
                <strong>{selectedShipment.origin} → {selectedShipment.destination}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border">
                <span className="text-cr-muted">Assigned Asset:</span>
                <strong>{selectedShipment.assignedAssetId || selectedShipment.assignedVehicleReg || 'Unassigned'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border">
                <span className="text-cr-muted">Gross Freight Revenue:</span>
                <strong className="text-cr-text">{formatINR(selectedShipment.revenue)}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border text-rose-700">
                <span>- Allocated Diesel Fuel Cost:</span>
                <span>-{formatINR(selectedShipment.allocatedFuelCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border text-rose-700">
                <span>- Driver Wages & Allowances:</span>
                <span>-{formatINR(selectedShipment.allocatedDriverCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border text-rose-700">
                <span>- Tolls (FASTag) & Road Permits:</span>
                <span>-{formatINR(selectedShipment.allocatedTollCost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cr-border text-rose-700">
                <span>- Preventive Maintenance Allowance:</span>
                <span>-{formatINR(selectedShipment.allocatedMaintenanceCost)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm font-bold bg-emerald-50 p-2 rounded">
                <span className="text-emerald-900">Net Realized Margin:</span>
                <span className="text-emerald-800">+{formatINR(selectedShipment.profit)} ({selectedShipment.profitMargin}%)</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedShipment(null)}
              className="w-full py-2 rounded bg-slate-900 text-white font-bold text-xs"
            >
              Close Ledger
            </button>
          </div>
        </div>
      )}

      {/* CREATE SHIPMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreate} className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 border border-cr-border shadow-2xl">
            <div className="flex items-center justify-between border-b border-cr-border pb-3">
              <h3 className="font-extrabold text-base text-cr-text">Create Freight Consignment</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="p-1 rounded hover:bg-cr-gray text-cr-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="col-span-2">
                <label className="text-cr-muted block mb-1">Customer / Shipper Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Industrial Pvt Ltd"
                  value={newCust}
                  onChange={(e) => setNewCust(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs font-sans text-cr-text"
                />
              </div>
              <div>
                <label className="text-cr-muted block mb-1">Origin City</label>
                <input
                  type="text"
                  required
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                />
              </div>
              <div>
                <label className="text-cr-muted block mb-1">Destination City</label>
                <input
                  type="text"
                  required
                  value={newDest}
                  onChange={(e) => setNewDest(e.target.value)}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                />
              </div>
              <div>
                <label className="text-cr-muted block mb-1">Weight (Tons)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(parseFloat(e.target.value))}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                />
              </div>
              <div>
                <label className="text-cr-muted block mb-1">Volume (m³)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={newVol}
                  onChange={(e) => setNewVol(parseFloat(e.target.value))}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text"
                />
              </div>
              <div className="col-span-2">
                <label className="text-cr-muted block mb-1">Customer Price / Freight Revenue (₹)</label>
                <input
                  type="number"
                  required
                  value={newRevenue}
                  onChange={(e) => setNewRevenue(parseInt(e.target.value))}
                  className="w-full bg-[#F8F8F6] border border-cr-border rounded p-2 text-xs text-cr-text font-bold"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded bg-cr-gray text-cr-text font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-cr-red text-white font-bold text-xs shadow-sm hover:bg-cr-red-dark"
              >
                Create Consignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
