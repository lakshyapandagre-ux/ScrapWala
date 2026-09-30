'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Leaf, 
  AlertOctagon, 
  ShieldCheck, 
  Check, 
  Filter,
  Flame,
  Award,
  RefreshCw,
  Plus,
  Save
} from 'lucide-react';
import { fetchMaterials, fetchLatestRates, insertMarketRate, Material } from '@/lib/market-data';

export const MineralsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rates' | 'dealers' | 'analytics'>('rates');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [rates, setRates] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Quick Update State
  const [updateValues, setUpdateValues] = useState<Record<string, number>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [mats, latestRates] = await Promise.all([
        fetchMaterials(),
        fetchLatestRates('Indore')
      ]);
      setMaterials(mats);
      setRates(latestRates);
      
      // Initialize edit state with current rates
      const initVals: Record<string, number> = {};
      mats.forEach(m => {
        const r = latestRates.find(x => x.material_id === m.id || x.slug === m.slug);
        if (r) initVals[m.id] = r.rate;
      });
      setUpdateValues(initVals);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRate = (materialId: string, val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setUpdateValues(prev => ({ ...prev, [materialId]: num }));
    } else if (val === '') {
      setUpdateValues(prev => ({ ...prev, [materialId]: 0 }));
    }
  };

  const handleSaveRates = async () => {
    setIsSaving(true);
    let successCount = 0;
    
    for (const mat of materials) {
      const currentRate = rates.find(r => r.material_id === mat.id)?.rate || 0;
      const newRate = updateValues[mat.id];
      
      // Only insert if changed
      if (newRate !== undefined && newRate !== currentRate && newRate > 0) {
        await insertMarketRate(mat.id, newRate, mat.unit, 'Indore');
        successCount++;
      }
    }
    
    if (successCount > 0) {
      alert(`Successfully updated ${successCount} rates in the database!`);
      await loadData();
    } else {
      alert('No rate changes detected.');
    }
    
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Market Rate Updates</p>
            <h3 className="text-xl font-black text-[#14181A]">Today (Indore)</h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Active Dealers</p>
            <h3 className="text-xl font-black text-[#14181A]">5 Verified</h3>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500">Total Scrap Categories</p>
            <h3 className="text-xl font-black text-[#14181A]">{materials.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button 
          onClick={() => setActiveTab('rates')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'rates' ? 'border-[#2E7D1F] text-[#2E7D1F]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Daily Market Rates
        </button>
        <button 
          onClick={() => setActiveTab('dealers')}
          className={`pb-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'dealers' ? 'border-[#2E7D1F] text-[#2E7D1F]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          Dealer Network & Offers
        </button>
      </div>

      {/* TAB CONTENT: RATES */}
      {activeTab === 'rates' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h2 className="text-lg font-black text-[#14181A]">Central Pricing Engine</h2>
              <p className="text-xs font-medium text-gray-500 mt-1">Update baseline market rates. This automatically affects "Best Deals" net amount calculations for all collectors.</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={loadData}
                disabled={isLoading}
                className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-xs flex items-center gap-2 hover:bg-gray-50 active:scale-95 disabled:opacity-50"
              >
                <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                Refresh
              </button>
              <button 
                onClick={handleSaveRates}
                disabled={isSaving || isLoading}
                className="h-10 px-5 rounded-xl bg-[#2E7D1F] text-white font-extrabold text-xs flex items-center gap-2 hover:bg-[#256618] active:scale-95 disabled:opacity-50 shadow-md"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Publish New Rates'}
              </button>
            </div>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[50px]">#</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Scrap Material</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[120px]">Category</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right w-[150px]">Current Rate</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[180px]">New Daily Rate</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500 text-sm font-medium">Loading data...</td>
                  </tr>
                ) : materials.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-500 text-sm font-medium">No materials found. Did you run the SQL seed script?</td>
                  </tr>
                ) : (
                  materials.map((mat, idx) => {
                    const currentRateObj = rates.find(r => r.material_id === mat.id || r.slug === mat.slug);
                    const currentRate = currentRateObj?.rate || 0;
                    const prevRate = currentRateObj?.prev_rate;
                    const newRate = updateValues[mat.id] !== undefined ? updateValues[mat.id] : currentRate;
                    
                    const isChanged = newRate !== currentRate;

                    return (
                      <tr key={mat.id} className={`hover:bg-gray-50/50 transition-colors ${isChanged ? 'bg-emerald-50/30' : ''}`}>
                        <td className="py-3 px-4 text-sm text-gray-400 font-bold">{idx + 1}</td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#14181A]">{mat.name_en}</div>
                          <div className="text-xs text-gray-500">{mat.name_hi}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 capitalize">
                            {mat.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="font-bold text-gray-800 tabular-nums">₹{currentRate} <span className="text-[10px] text-gray-400 font-normal">/{mat.unit}</span></div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-gray-500 font-bold text-sm">₹</span>
                            <input 
                              type="number" 
                              value={updateValues[mat.id] === 0 ? '' : updateValues[mat.id]}
                              onChange={(e) => handleUpdateRate(mat.id, e.target.value)}
                              className={`w-full h-9 pl-7 pr-3 rounded-lg border text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#2E7D1F] ${isChanged ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-gray-300'}`}
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {prevRate && currentRate > prevRate ? (
                            <span className="text-emerald-600 text-xs font-bold flex items-center justify-end gap-1"><TrendingUp size={14} /> +₹{currentRate - prevRate}</span>
                          ) : prevRate && currentRate < prevRate ? (
                            <span className="text-red-500 text-xs font-bold flex items-center justify-end gap-1"><TrendingUp size={14} className="rotate-180" /> -₹{prevRate - currentRate}</span>
                          ) : (
                            <span className="text-gray-400 text-xs font-semibold">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DEALERS */}
      {activeTab === 'dealers' && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Building2 size={32} />
          </div>
          <h2 className="text-xl font-black text-[#14181A] mb-2">Dealer Network Management</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            View verified dealers and their custom offers. Data is seeded via the SQL script and served via Supabase.
          </p>
          <div className="mt-6 flex justify-center">
            <button className="h-10 px-5 rounded-xl bg-[#14181A] text-white font-bold text-sm shadow-md hover:bg-black active:scale-95">
              View Database Tables
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
