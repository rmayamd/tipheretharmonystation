// lib/protocols/surgical-engine.ts

export const TIPHERET_SURGICAL_CONTEXT = {
  sedation: {
    protocol: "Ketofol",
    components: [
      { name: "Propofol", function: "Hipnosis/Amnesia", manual_ref: "CIB p.1102" },
      { name: "Ketamina", function: "Analgesia Disociativa", manual_ref: "CIB p.1105" }
    ],
    local_anesthesia: "Lidocaína 2% + Epinefrina 1:200.000"
  },
  
  strata_shielding: {
    SKIN: { agent: "Cefadroxilo 500mg", freq: "12h", focus: "Staph/Piel" },
    BONE: { agent: "Ciprofloxacino 500mg", freq: "12h", focus: "Gram(-)/Tejido Óseo" },
    DEEP_SOFT: { agent: "TMP/SMX 160/800mg", freq: "12h", focus: "Resistencia Bacteriana" }
  },

  pain_control: {
    hemostasis_safe: "Celecoxib 200mg/día", // No afecta plaquetas
    rescue: "Ibuprofeno + Codeína c/12h",
    vascular_safety: "Clexane 20mg SC/día"
  }
};