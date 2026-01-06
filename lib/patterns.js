// PATRONES DE EXTRACCIÓN MÉDICA
// Cada patrón está claramente documentado y es fácil de modificar

const EXTRACTION_PATTERNS = {
    // ============== HEMOGRAMA ==============
    hemograma: {
        hemoglobina: /HEMOGLOBINA\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        hematocrito: /HEMATOCRITO\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        leucocitos: /RECUENTO\s+(?:DE\s+)?LEUCOCITOS\s*[hi*]*\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i,
        neutrofilos_porcentaje: /NEUTROFILOS\s*%\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        linfocitos_porcentaje: /LINFOCITOS\s*%\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        plaquetas: /RECUENTO\s+(?:DE\s+)?PLAQUETAS\s*[hi*]*\s*(\d+)\s*(?:10\^3|10e3)\/uL/i,
        vcm: /VCM-?\s*VOLUMEN\s+CORPUSCULAR\s+MEDIO\s\D*(\d+\.?\d*)\s*fL/i,
        chcm: /CHCM\s*-\s*CONC\.\s*Hb\s*CORPUSCULAR\s*MEDIA\s\D*(\d+\.?\d*)\s*g\/dL/i,
        rdw: /RDW\s*[i]?\s\D*(\d+\.?\d*)\s*%/i,
        reticulocitos: /RETICULOCITOS\s\D*(\d+\.?\d*)\s*%/i,
        neutrofilos_absoluto: /NEUTROFILOS\s*[hi*]*\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i,
        linfocitos_absoluto: /LINFOCITOS\s*[hi*]*\s*(\d+\.?\d*)\s*(?:10\^3|10e3)\/uL/i
    },

    // ============== FUNCIÓN RENAL ==============
    renal: {
        creatinina: /CREATININA\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        vfg: /VFG\s\D*(\d+\.?\d*)\s*mL\/min/i,
        bun: /NITROGENO\s+UREICO(?:\s*\(BUN\))?\s*[hi*]*\s*(\d+\.?\d*)\s*mg(?:%|\/dL)?/i,
        urea: /UREA\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        sodio: /(?:ELECTROLITO\s+)?SODIO\s*[hi*]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        potasio: /(?:ELECTROLITO\s+)?POTASIO\s*[hi*]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        cloro: /(?:ELECTROLITO\s+)?CLORO\s*[hi*]*\s*(\d+\.?\d*)\s*mEq\/L/i,
        fosforo: /FOSFORO\s*(?:SERICO)?\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        calcio: /CALCIO\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        magnesio: /MAGNESIO\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        acido_urico: /ACIDO\s+URICO\s\D*(\d+\.?\d*)\s*mg\/dL/i
    },

    // ============== FUNCIÓN HEPÁTICA ==============
    hepatico: {
        bilirrubina_total: /(?:Bilirrubina Total|BILIRRUBINA TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        bilirrubina_directa: /(?:Bilirrubina Directa|BILIRRUBINA DIRECTA)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        got_asat: [
            /ASPARTATO AMINO TRANSFERASA[\s\S]*?\(ASAT\/GOT\)[\s\S]*?(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GOT\/ASAT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GOT|ASAT)\s*\*?\s*(\d+\.?\d*)\s*U\/L/i
        ],
        gpt_alt: [
            /ALANINA AMINO TRANSFERASA[\s\S]*?\(ALAT\/GPT\)[\s\S]*?[hi]*\s*(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GPT\/\s?ALT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GPT|ALT)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        fosfatasa_alcalina: /(?:Fosfatasa Alcalina|FOSFATASAS ALCALINAS)\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,
        ggt: [
            /Gamma Glutamiltranspeptidasa\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /GAMAGLUTAMIL TRANSFERASA \(GGT\)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],
        amilasa: /AMILASA\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i,
        lipasa: /LIPASA\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
    },

    // ============== NUTRICIONAL ==============
    nutricional: {
        proteinas: /(?:Proteínas|PROTEINAS TOTALES)\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        albumina: /(?:Albúmina|ALBUMINA)\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,
        prealbumin: /(?:Prealbúmina|Prealbumina|PRE-ALBUMINA)\s*[hi*]*\s*(\d+\.?\d*)/i,
        colesterol_total: /(?:Colesterol Total|COLESTEROL TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        ldl: /(?:Colesterol LDL|LDL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,
        hdl: /(?:Colesterol HDL|HDL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i
    },

    // ============== PCR Y MARCADORES INFLAMATORIOS ==============
    pcr: {
        pcr: [
            /PROTEINA\s+C\s+REACTIVA\s*\(?CRP\)?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i,
            /Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i
        ],
        procalcitonina: /Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i,
        vhs: /(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i
    },

    // ============== COAGULACIÓN ==============
    coagulacion: {
        inr: /INR\s*[hi*]*\s*(\d+\.?\d*)/i,
        tiempo_protrombina: /TIEMPO DE PROTROMBINA\s*[hi*]*\s*(\d+\.?\d*)\s*Segundos/i,
        porcentaje_tp: /%\s*TP\s*[hi*]*\s*(\d+\.?\d*)\s*%/i,
        ttpa: /TIEMPO DE TROMBOPLASTINA PARCIAL\s+ACTIVADO\s*[hi*]*\s*(\d+\.?\d*)\s*Segundos/i
    },

    // ============== GASES EN SANGRE ==============
    gases: {
        ph: /\bpH\s*[hi*]*\s*(\d+\.?\d*)/i,
        pco2: /PCO2[\s\S]*?(\d+\.?\d*)\s+mmHg/i,
        hco3: /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/i,
        saturacion_o2: /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/i
    },

    // ============== FECHAS ==============
    fechas: {
        patrones: [
            /Recepcion\s+muestra\s*:\s*(\d{2}[-\/]\d{2}[-\/]\d{4})/i,        // "Recepcion muestra: dd/mm/yyyy" o "Recepcion muestra: dd-mm-yyyy"
            /Fecha\s+(\d{2}\/\d{2}\/\d{4})/i,                              // "Fecha dd/mm/yyyy"
            /Toma Muestra:\s*(\d{2}\/\d{2}\/\d{4})/i,                      // "Toma Muestra: dd/mm/yyyy"
            /Fecha\/Hora de T\. muestra\s*:\s*(\d{2}\/\d{2}\/\d{4})/i,     // "Fecha/Hora de T. muestra : dd/mm/yyyy"
            /^(\d{2}\/\d{2}\/\d{4})/m,                                     // Fecha al inicio de línea
            /(\d{2}\/\d{2}\/\d{4})/                                        // Cualquier fecha dd/mm/yyyy
        ]
    }
};

// Función auxiliar para buscar con múltiples patrones
function buscarConPatrones(texto, patrones) {
    // Si es un solo patrón, convertirlo a array
    if (patrones instanceof RegExp) {
        patrones = [patrones];
    }

    // Probar cada patrón hasta encontrar una coincidencia
    for (let patron of patrones) {
        let coincidencia = texto.match(patron);
        if (coincidencia) {
            return coincidencia;
        }
    }

    return null; // No se encontró ninguna coincidencia
}

// Función simple para extraer un valor usando un patrón
function extraerValor(texto, patron) {
    let coincidencia = buscarConPatrones(texto, patron);
    return coincidencia ? coincidencia[1] : null;
}

// Exportar para uso en script.js
window.EXTRACTION_PATTERNS = EXTRACTION_PATTERNS;
window.buscarConPatrones = buscarConPatrones;
window.extraerValor = extraerValor;
