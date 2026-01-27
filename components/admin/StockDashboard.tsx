'use client'

import React, { useState } from 'react';
import { Package, AlertTriangle, ShoppingCart, Plus, History } from 'lucide-react';
import { OrderGenerator } from '@/lib/inventory/order-generator';
import { OrderPreview } from './OrderPreview';

const initialStock = [
  { id: 'AB-CEF', name: 'Cefadroxilo 500mg', stock: 120, min: 40, unit: 'Tabs', category: 'Antibiótico' },
  { id: 'AB-CIP', name: 'Ciprofloxacino 500mg', stock: 85, min: 40, unit: 'Tabs', category: 'Antibiótico' },
  { id: 'AN-CEL', name: 'Celecoxib 200mg', stock: 15, min: 30, unit: 'Caps', category: 'Analgesia' },
  { id: 'CN-T01', name: 'Calm Night (Chocolate)', stock: 50, min: 20, unit: 'Tabs', category: 'Suplemento' },
  { id: 'AC-CLE', name: 'Clexane 20mg', stock: 8, min: 15, unit: 'Amp', category: 'Vascular' },
  { id: 'IN-FAJ', name: 'Fajas Post-Op', stock: 25, min: 10, unit: 'Und', category: 'Insumos' },
];

export const StockDashboard = () => {
  const [items] = useState(initialStock);
  const [activeOrder, setActiveOrder] = useState<any>(null);

  const handleGenerateOrder = () => {
    const lowStockItems = items.filter(item => item.stock <= item.min);
    if (lowStockItems.length === 0) return alert("Stock OK");
    const orders = OrderGenerator.generateFromLowStock(lowStockItems);
    setActiveOrder(orders[0]);
  };

  return (
    <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 shadow-2xl max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-white font-black text-2xl uppercase tracking-tighter italic">Almacén <span className="text-purple-500">Tiphereth</span></h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className={`p-5 rounded-3xl border ${item.stock <= item.min ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5'}`}>
            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-xs uppercase">{item.name}</span>
              <span className="text-2xl font-mono font-black text-white">{item.stock}</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleGenerateOrder} className="w-full mt-10 p-5 bg-purple-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest italic shadow-xl">
        Generar Orden FM-MD-07
      </button>
      {activeOrder && <OrderPreview order={activeOrder} onClose={() => setActiveOrder(null)} />}
    </div>
  );
};