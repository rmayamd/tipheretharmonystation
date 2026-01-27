/**
 * WOMPI INTEGRATION - TIPHERET CENTER
 * Pasarela de pagos oficial para Cartagena
 */

export interface WompiConfig {
  publicKey: string;
  currency: string;
  amountInCents: number;
  reference: string;
  signature?: string;
  redirectUrl: string;
}

/**
 * Genera una referencia única para la transacción
 */
export function generateOrderReference(): string {
  return `TIPH-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Convierte el total de la orden a centavos (requerido por Wompi)
 */
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Abre el widget de Wompi para procesar el pago
 * NOTA: En un entorno real, esto requiere cargar el script de Wompi en el cliente
 */
export function openWompiWidget(config: WompiConfig) {
  // @ts-ignore - Wompi se carga vía script en el index/layout
  if (typeof window !== 'undefined' && (window as any).Wompi) {
    const checkout = new (window as any).WompiWidget({
      publicKey: config.publicKey,
      currency: config.currency,
      amountInCents: config.amountInCents,
      reference: config.reference,
      redirectUrl: config.redirectUrl,
    });

    checkout.open((result: any) => {
      const transaction = result.transaction;
      console.log('Transacción completada:', transaction);
      if (transaction.status === 'APPROVED') {
        window.location.href = `${config.redirectUrl}?status=approved&id=${transaction.id}`;
      }
    });
  } else {
    // Fallback: Si el script no carga, abrir link de pago manual o mostrar error
    console.error('Wompi Widget no cargado');
    alert('Iniciando pasarela de pago... (Redirigiendo)');
    
    // Simulación de redirección a checkout externo si el widget falla
    const dummyCheckoutUrl = `https://checkout.wompi.co/p/?public-key=${config.publicKey}&currency=${config.currency}&amount-in-cents=${config.amountInCents}&reference=${config.reference}&redirect-url=${config.redirectUrl}`;
    window.open(dummyCheckoutUrl, '_blank');
  }
}
