/**
 * TIPHERETH SHOP - MOTOR DE E-COMMERCE V5.2
 * Catálogo Internacional: Mesoestetic + Obagi + Tiphereth Pharma
 */

export interface ShopItem {
  id: string;
  name: string;
  brand: 'mesoestetic' | 'obagi' | 'tiphereth' | 'radiant' | 'jalupro';
  category: 'skincare' | 'supplement' | 'recovery' | 'injectable';
  price_cop: number;
  description: string;
  stock: number;
}

export const MESOESTETIC_CATALOG_2025: ShopItem[] = [
  {
    id: 'meso_aox_ferulic',
    name: 'AOX Ferulic',
    brand: 'mesoestetic',
    category: 'skincare',
    price_cop: 420000,
    description: 'Tratamiento antioxidante de vanguardia. Protege contra radiaciones y oxidación.',
    stock: 50
  },
  {
    id: 'meso_melan_tran3x_gel',
    name: 'Melan Tran3x Gel Cream',
    brand: 'mesoestetic',
    category: 'skincare',
    price_cop: 380000,
    description: 'Crema despigmentante diaria con ácido tranexámico.',
    stock: 30
  },
  {
    id: 'meso_ha_densimatrix',
    name: 'HA Densimatrix',
    brand: 'mesoestetic',
    category: 'skincare',
    price_cop: 350000,
    description: 'Concentrado de ácido hialurónico multi-molecular.',
    stock: 40
  },
  {
    id: 'meso_fast_skin_repair',
    name: 'Fast Skin Repair',
    brand: 'mesoestetic',
    category: 'recovery',
    price_cop: 290000,
    description: 'Crema reparadora intensiva para post-procedimientos.',
    stock: 25
  }
];

export const OBAGI_CATALOG: ShopItem[] = [
  {
    id: 'obagi_nu_derm_gentle_cleanser',
    name: 'Nu-Derm Gentle Cleanser',
    brand: 'obagi',
    category: 'skincare',
    price_cop: 250000,
    description: 'Limpiador suave para pieles sensibles.',
    stock: 15
  }
];

export const TIPHERETH_LINE: ShopItem[] = [
  // ✨ EL NUEVO PRODUCTO ESTRELLA
  {
    id: 'tiphereth_kit_post_op',
    name: 'Kit Post-Quirúrgico Regenerativo Premium',
    brand: 'tiphereth',
    category: 'recovery',
    price_cop: 680000,
    description: 'Protocolo Ogawa/Maya: Gel de silicona grado médico, Árnica Montana, Zinc quelado y Factores de Crecimiento. Optimiza la cicatrización invisible.',
    stock: 50
  },
  {
    id: 'tiphereth_collagen_pro',
    name: 'Tiphereth Collagen Pro+',
    brand: 'tiphereth',
    category: 'supplement',
    price_cop: 180000,
    description: 'Colágeno hidrolizado tipo I y III con péptidos bioactivos para redensificación dérmica.',
    stock: 100
  },
  {
    id: 'tiphereth_omega_ultra',
    name: 'Tiphereth Omega Ultra Pure',
    brand: 'tiphereth',
    category: 'supplement',
    price_cop: 120000,
    description: 'Omega-3 destilado molecularmente. Alta potencia anti-inflamatoria sistémica.',
    stock: 80
  }
];

export function getFullCatalog(): ShopItem[] {
  return [...MESOESTETIC_CATALOG_2025, ...OBAGI_CATALOG, ...TIPHERETH_LINE];
}

export function findItemById(id: string): ShopItem | undefined {
  return getFullCatalog().find(item => item.id === id);
}

export function calculateOrderTotal(items: { id: string, quantity: number }[]): number {
  return items.reduce((total, orderItem) => {
    const item = findItemById(orderItem.id);
    return total + (item ? item.price_cop * orderItem.quantity : 0);
  }, 0);
}