// lib/protocols/surgical-engine.ts

export const TIPHERET_SURGICAL_LOGIC = {
  // BLINDAJE POR ESTRATOS
  antibiotics: {
    layer_1_skin: "Cefadroxilo 500mg c/12h",
    layer_2_deep: "Ciprofloxacino 500mg c/12h (o TMP/SMX)",
    rationale: "Doble cobertura: Piel (Gram+) y Profundidad/Hueso (Gram-)."
  },
  
  // AHORRO DE OPIOIDES (OPIOID-SPARING)
  multimodal_analgesia: {
    base: "Acetaminofén 1g c/8h",
    hemostasis_safe: "Celecoxib 200mg/día (Inhibidor COX-2: No altera plaquetas)",
    neuromodulation: "Pregabalina 75mg/noche (Previene sensibilización central)",
    rescue_only: "Ibuprofeno + Codeína (Solo si EVA > 6)"
  },

  // SEDACIÓN KETOFOL
  sedation_protocol: {
    agents: ["Propofol", "Ketamina"],
    benefits: "Estabilidad hemodinámica y analgesia disociativa."
  }
};