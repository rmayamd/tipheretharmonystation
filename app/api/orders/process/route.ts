import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

/**
 * MAYA-CORE: PROCESAMIENTO DE ÓRDENES
 * Forzamos que la ruta sea dinámica para que Netlify no falle durante el build
 */
export const dynamic = 'force-dynamic';

/**
 * API Route para procesar órdenes de Wompi post-pago
 */
export async function POST(request: NextRequest) {
  try {
    // Verificación de seguridad para el Build de Netlify
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Database credentials not found' }, { status: 500 });
    }

    const body = await request.json();
    const { transactionId, status, items, total, patientEmail, patientName } = body;

    if (status !== 'approved') {
      return NextResponse.json({ error: 'Pago no aprobado' }, { status: 400 });
    }

    // 1. REGISTRAR ORDEN EN SUPABASE
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        transaction_id: transactionId,
        patient_email: patientEmail,
        patient_name: patientName,
        items: JSON.stringify(items),
        total_cop: total,
        status: 'paid',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creando orden:', orderError);
      return NextResponse.json({ error: 'Error registrando orden' }, { status: 500 });
    }

    // 2. ACTUALIZAR INVENTARIO
    for (const item of items) {
      const { error: stockError } = await supabase.rpc('decrease_stock', {
        product_id: item.id,
        quantity: item.quantity
      });
      if (stockError) console.error(`Error stock ${item.id}:`, stockError);
    }

    // 3. CREAR TICKET DE DESPACHO
    await supabase.from('dispatch_tickets').insert({
      order_id: order.id,
      status: 'pending',
      items: JSON.stringify(items),
      created_at: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Orden procesada exitosamente'
    });

  } catch (error: any) {
    console.error('Error procesando orden:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Webhook de Wompi
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('id');
  const status = searchParams.get('status');

  if (!transactionId || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Faltan parámetros o configuración' }, { status: 400 });
  }

  const { error } = await supabase
    .from('orders')
    .update({ status: status === 'APPROVED' ? 'paid' : 'failed' })
    .eq('transaction_id', transactionId);

  if (error) return NextResponse.json({ error: 'Error actualizando orden' }, { status: 500 });

  return NextResponse.json({ success: true, message: 'Orden actualizada' });
}