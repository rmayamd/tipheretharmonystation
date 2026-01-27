/**
 * Sistema de Manejo de Errores Centralizado
 */

export class MayaError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'low' | 'medium' | 'high' = 'medium'
  ) {
    super(message)
    this.name = 'MayaError'
  }
}

export function handleError(error: unknown): {
  message: string
  code: string
  severity: 'low' | 'medium' | 'high'
} {
  if (error instanceof MayaError) {
    return {
      message: error.message,
      code: error.code,
      severity: error.severity,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'UNKNOWN_ERROR',
      severity: 'medium',
    }
  }

  return {
    message: 'Error desconocido',
    code: 'UNKNOWN_ERROR',
    severity: 'low',
  }
}

/**
 * Errores específicos del sistema
 */
export const ErrorCodes = {
  INBODY_INVALID_DATA: 'INBODY_INVALID_DATA',
  PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
  ORDER_GENERATION_FAILED: 'ORDER_GENERATION_FAILED',
  RECOMMENDATION_NOT_FOUND: 'RECOMMENDATION_NOT_FOUND',
  SUPABASE_CONNECTION_FAILED: 'SUPABASE_CONNECTION_FAILED',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  INVALID_PROTOCOL: 'INVALID_PROTOCOL',
} as const
