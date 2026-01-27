// lib/inventory/stock-service.ts

export interface InventoryItem {
    code: string;       // Basado en FM-MD-06
    name: string;
    unit: string;
    stock: number;
    minStock: number;
    providerId: string; // Basado en FM-MD-01
  }
  
  export const KIT_BOM = { 
    'POP_MASTER_LIPO': [
      { code: 'AB-CEF', qty: 20, name: 'Cefadroxilo 500mg' },
      { code: 'AB-CIP', qty: 20, name: 'Ciprofloxacino 500mg' },
      { code: 'AN-CEL', qty: 10, name: 'Celecoxib 200mg' },
      { code: 'NE-PRE', qty: 10, name: 'Pregabalina 75mg' },
      { code: 'AC-CLE', qty: 10, name: 'Clexane 20mg' },
      { code: 'IN-FAJ', qty: 2,  name: 'Fajas Post-Quirúrgicas' },
      { code: 'CI-KEL', qty: 1,  name: 'Kelo-cote / Gel Silicona' },
      // INTEGRACIÓN CALM NIGHT
      { code: 'CN-T01', qty: 10, name: 'Tiphereth Calm Night (Chocolate)' } 
    ]
  };
  
  
  
  export class StockService {
    /**
     * 1. Descuento Automático Post-Venta
     * Se dispara cuando Wompi confirma el pago del Kit.
     */
    static async processSale(kitType: keyof typeof KIT_BOM) {
      const items = KIT_BOM[kitType];
      console.log(`[LOGÍSTICA] Procesando salida de inventario para ${kitType}...`);
  
      for (const item of items) {
        try {
          // Actualización real en la base de datos (Supabase/Postgres)
          await this.updateDatabaseStock(item.code, item.qty);
          
          // 2. Verificación de Alerta de Reorden (Basado en FM-MD-06)
          await this.verifyReorderLevel(item.code);
        } catch (error) {
          console.error(`[ERROR] Fallo al actualizar stock de ${item.name}:`, error);
        }
      }
    }
  
    /**
     * 2. Lógica de Reorden (FM-MD-07)
     * Si el stock actual es menor al mínimo, genera una alerta.
     */
    static async verifyReorderLevel(code: string) {
      // Simulación: En la vida real aquí harías un SELECT stock de la DB
      const currentStock = 15; // Ejemplo
      const minStock = 20;    // Ejemplo basado en su FM-MD-06
  
      if (currentStock < minStock) {
        console.warn(`[CRÍTICO] ${code} bajo el nivel mínimo. Generando borrador de FM-MD-07...`);
        // Aquí se podría disparar un webhook a Zapier para enviarle un WhatsApp
      }
    }
  
    private static async updateDatabaseStock(code: string, qty: number) {
      // Aquí iría su llamada a Supabase o su API de base de datos
      // console.log(`UPDATE inventory SET stock = stock - ${qty} WHERE code = '${code}'`);
    }
  }