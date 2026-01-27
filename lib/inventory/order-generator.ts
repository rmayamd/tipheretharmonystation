// lib/inventory/order-generator.ts

export class OrderGenerator {
    static generateFromLowStock(lowItems: any[]) {
      const providerMap: Record<string, string> = {
        'AB': 'Farma Quirúrgica',
        'AC': 'Suministros Médicos',
        'CN': 'Tiphereth Lab',
        'IN': 'Textiles Médicos'
      };
  
      const grouped = lowItems.reduce((acc: any, item: any) => {
        const prefix = item.id.split('-')[0];
        const provider = providerMap[prefix] || 'General';
        if (!acc[provider]) acc[provider] = [];
        acc[provider].push(item);
        return acc;
      }, {});
  
      return Object.entries(grouped).map(([provider, items]: [string, any], index) => ({
        id: `FM-MD-07-2026-${index + 1}`,
        date: new Date().toLocaleDateString(),
        provider,
        items: items.map((i: any) => ({ name: i.name, qty: i.min * 2, unit: i.unit }))
      }));
    }
  }