/**
 * SUPABASE - STORED PROCEDURE PARA ACTUALIZAR INVENTARIO
 * Ejecutar este SQL en Supabase SQL Editor
 */

-- Tabla de órdenes (si no existe)
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  transaction_id TEXT UNIQUE NOT NULL,
  patient_email TEXT NOT NULL,
  patient_name TEXT,
  items JSONB NOT NULL,
  total_cop INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'shipped', 'delivered'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de inventario (catálogo con stock)
CREATE TABLE IF NOT EXISTS shop_inventory (
  id TEXT PRIMARY KEY, -- mismo ID que en tipheret-shop.ts
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  price_cop INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  reserved_stock INTEGER NOT NULL DEFAULT 0, -- Stock reservado en carritos activos
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tickets de despacho
CREATE TABLE IF NOT EXISTS dispatch_tickets (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'packed', 'shipped', 'delivered'
  items JSONB NOT NULL,
  tracking_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Función para decrementar stock de forma atómica (evita overselling)
CREATE OR REPLACE FUNCTION decrease_stock(product_id TEXT, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE shop_inventory
  SET 
    stock = stock - quantity,
    updated_at = NOW()
  WHERE id = product_id AND stock >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % sin stock suficiente', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para reservar stock (cuando se agrega al carrito)
CREATE OR REPLACE FUNCTION reserve_stock(product_id TEXT, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE shop_inventory
  SET 
    reserved_stock = reserved_stock + quantity,
    updated_at = NOW()
  WHERE id = product_id AND (stock - reserved_stock) >= quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Producto % sin stock disponible', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Función para liberar stock reservado (cuando se vacía el carrito)
CREATE OR REPLACE FUNCTION release_stock(product_id TEXT, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE shop_inventory
  SET 
    reserved_stock = GREATEST(0, reserved_stock - quantity),
    updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- Insertar catálogo inicial (Mesoestetic + Obagi + Tiphereth)
INSERT INTO shop_inventory (id, name, brand, category, price_cop, stock) VALUES
  ('meso_aox_ferulic', 'AOX Ferulic', 'mesoestetic', 'skincare', 420000, 50),
  ('meso_melan_tran3x_gel', 'Melan Tran3x Gel Cream', 'mesoestetic', 'skincare', 380000, 30),
  ('meso_ha_densimatrix', 'HA Densimatrix', 'mesoestetic', 'skincare', 350000, 40),
  ('meso_fast_skin_repair', 'Fast Skin Repair', 'mesoestetic', 'recovery', 290000, 25),
  ('meso_ultimate_w_plus', 'Ultimate W+ Whitening Cream', 'mesoestetic', 'skincare', 340000, 20),
  ('obagi_nu_derm_gentle_cleanser', 'Nu-Derm Gentle Cleanser', 'obagi', 'skincare', 250000, 15),
  ('obagi_professional_c_serum_15', 'Professional-C Serum 15%', 'obagi', 'skincare', 480000, 10),
  ('tiphereth_collagen_pro', 'Tiphereth Collagen Pro+', 'tiphereth', 'supplement', 180000, 100),
  ('tiphereth_omega_ultra', 'Tiphereth Omega Ultra Pure', 'tiphereth', 'supplement', 120000, 80)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  price_cop = EXCLUDED.price_cop,
  stock = EXCLUDED.stock;

-- Habilitar RLS para seguridad
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_tickets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (acceso solo para autenticados)
CREATE POLICY "Allow authenticated to read inventory" ON shop_inventory FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated to insert orders" ON orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated to read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated to read dispatch tickets" ON dispatch_tickets FOR SELECT TO authenticated USING (true);

-- Nota: En producción, ajustar políticas RLS según roles (admin, customer, etc.)
