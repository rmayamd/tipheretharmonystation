/**
 * TIPHERETH SHOP - V5.2 (INTERNATIONAL E-COMMERCE)
 * Pasarela de Pagos Integrada: Wompi + Logística Propia
 */

'use client'

// Directiva crítica para evitar errores de compilación en Netlify
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { ShoppingCart, ShoppingBag, Package, CheckCircle, Trash2, CreditCard, ShieldCheck, Globe } from 'lucide-react'
import { getFullCatalog, ShopItem } from '@/lib/shop/tipheret-shop'
import { openWompiWidget, generateOrderReference, toCents } from '@/lib/shop/wompi-integration'
import Script from 'next/script' // Corregido: Importación estándar de Next.js

export default function TipheretShopPage() {
  const [cart, setCart] = useState<{ item: ShopItem, quantity: number }[]>([])
  const [orderComplete, setOrderSent] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const catalog = getFullCatalog()

  // Sincronización de estado de pago desde la URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('status') === 'approved') {
        const transactionId = params.get('id')
        setOrderSent(true)
        setCart([])
        console.log('💳 Pago aprobado por pasarela internacional. ID:', transactionId)
      }
    }
  }, [])

  const addToCart = (item: ShopItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id)
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item.id !== id))
  }

  const total = cart.reduce((sum, i) => sum + i.item.price_cop * i.quantity, 0)

  const handleCheckout = () => {
    if (cart.length === 0) return
    setIsPaying(true)
    
    // Configuración Wompi (Cargada desde variables de entorno de Netlify)
    const wompiConfig = {
      publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || 'pub_test_Q5yDA9xoKdePzhS8qn96XPr65SAsm56y',
      currency: 'COP',
      amountInCents: toCents(total),
      reference: generateOrderReference(),
      redirectUrl: window.location.origin + window.location.pathname,
    }

    try {
      openWompiWidget(wompiConfig)
    } catch (err) {
      console.error('Error al abrir pasarela:', err)
    } finally {
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Script Maestro de Wompi */}
      <Script 
        src="https://checkout.wompi.co/widget.js" 
        strategy="afterInteractive"
      />

      {/* HEADER DE PRESTIGIO */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-black p-12 text-center border-b border-white/5">
        <div className="inline-flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-6">
          <Globe className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-300">Despachos Internacionales Ready</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white uppercase mb-4">
          TIPHERETH <span className="text-purple-500">BOUTIQUE</span>
        </h1>
        <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
          Protocolos de Grado Médico: Longevidad, Epigenética y Dermocosmética Avanzada.
        </p>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* SECCIÓN DE PRODUCTOS */}
          <div className="lg:col-span-8 space-y-10">
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {['Todos', 'mesoestetic', 'obagi', 'tipheret pharma'].map(brand => (
                <button key={brand} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 transition-all">
                  {brand}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {catalog.map(item => (
                <div key={item.id} className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-8 hover:border-purple-500/50 transition-all group backdrop-blur-xl">
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full">
                      {item.brand}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{item.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-8 h-12 overflow-hidden">{item.description}</p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Precio Base</p>
                      <span className="text-3xl font-black text-white">${item.price_cop.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="bg-white text-black p-5 rounded-[1.5rem] hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHECKOUT LATERAL */}
          <div className="lg:col-span-4">
            <div className="bg-white text-black rounded-[3rem] p-10 sticky top-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShoppingBag className="w-32 h-32" />
              </div>
              
              <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                <Package className="text-purple-600" /> RESUMEN
              </h2>

              {cart.length > 0 ? (
                <>
                  <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-2">
                    {cart.map(i => (
                      <div key={i.item.id} className="flex justify-between items-center border-b border-black/5 pb-4">
                        <div className="flex-1">
                          <p className="font-bold text-sm uppercase leading-tight">{i.item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400">UNIDADES: {i.quantity}</p>
                        </div>
                        <div className="flex items-center gap-4 ml-4">
                          <span className="font-black text-sm">${(i.item.price_cop * i.quantity).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(i.item.id)} className="text-red-500 hover:scale-110 transition-transform">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase text-slate-400">Total Orden</span>
                      <span className="text-4xl font-black text-black">${total.toLocaleString()}</span>
                    </div>

                    {orderComplete ? (
                      <div className="bg-green-600 text-white p-6 rounded-[2rem] text-center border-b-4 border-green-800 animate-in zoom-in-95 duration-300">
                        <CheckCircle className="w-10 h-10 mx-auto mb-3" />
                        <p className="font-black uppercase tracking-tighter text-lg">Transacción Exitosa</p>
                        <p className="text-xs opacity-80 mt-1">Despacho en preparación por Tiphereth Pharma.</p>
                      </div>
                    ) : (
                      <button 
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || isPaying}
                        className="w-full bg-black text-white py-6 rounded-2xl font-black text-lg tracking-tighter shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                      >
                        <CreditCard className="w-5 h-5" />
                        {isPaying ? 'SINCRONIZANDO...' : 'PAGAR CON WOMPI'}
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-20">
                  <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Carrito Vacío</p>
                </div>
              )}

              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-green-600">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Checkout</span>
                </div>
                <img src="https://wompi.co/assets/img/logos-pagos.png" alt="Métodos de pago" className="h-4 opacity-40 grayscale" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}