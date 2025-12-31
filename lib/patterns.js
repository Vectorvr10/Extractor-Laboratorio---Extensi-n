// PATRONES DE EXTRACCIÓN MÉDICA
// Cada patrón está claramente documentado y es fácil de modificar

const EXTRACTION_PATTERNS = {
    // ============== HEMOGRAMA ==============
    hemograma: {
        // Hemoglobina: busca "HEMOGLOBINA" seguido de números y "g/dL"
        hemoglobina: /HEMOGLOBINA\s*[hi]*\s*(\d+\.?\d*)\s*g\/dL/i,

        // Hematocrito: busca "HEMATOCRITO" seguido de números y "%"
        hematocrito: /HEMATOCRITO\s*[hi]*\s*(\d+\.?\d*)\s*%/i,

        // Leucocitos: busca "RECUENTO DE LEUCOCITOS" seguido de números y "10^3/uL"
        leucocitos: /RECUENTO DE LEUCOCITOS\s*[hi]*\s*(\d+\.?\d*)\s*10\^3\/uL/i,

        // Neutrófilos porcentaje: busca "NEUTROFILOS %" seguido de números
        neutrofilos_porcentaje: /NEUTROFILOS\s*%\s*[hi]*\s*(\d+\.?\d*)\s*%/i,

        // Linfocitos porcentaje: busca "LINFOCITOS %" seguido de números
        linfocitos_porcentaje: /LINFOCITOS\s*%\s*[hi]*\s*(\d+\.?\d*)\s*%/i,

        // Plaquetas: busca "RECUENTO DE PLAQUETAS" seguido de números y "10^3/uL"
        plaquetas: /RECUENTO DE PLAQUETAS\s*[hi]*\s*(\d+)\s*10\^3\/uL/i,

        // VCM: Volumen Corpuscular Medio
        vcm: /VCM-?\s*VOLUMEN\s+CORPUSCULAR\s+MEDIO\s\D*(\d+\.?\d*)\s*fL/i,

        // CHCM: Concentración de Hb Corpuscular Media
        chcm: /CHCM\s*-\s*CONC\.\s*Hb\s*CORPUSCULAR\s*MEDIA\s\D*(\d+\.?\d*)\s*g\/dL/i,

        // RDW: Red Cell Distribution Width
        rdw: /RDW\s*[i]?\s\D*(\d+\.?\d*)\s*%/i,

        // Reticulocitos
        reticulocitos: /RETICULOCITOS\s\D*(\d+\.?\d*)\s*%/i,

        // Neutrófilos Absoluto (RAN)
        neutrofilos_absoluto: /NEUTROFILOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i,

        // Linfocitos Absoluto (RAL)
        linfocitos_absoluto: /LINFOCITOS\s\D*(\d+\.?\d*)\s*10\^3\/uL/i
    },

    // ============== FUNCIÓN RENAL ==============
    renal: {
        // Creatinina: busca "CREATININA" seguido de números y "mg/dL"
        creatinina: /CREATININA\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // VFG: Velocidad de Filtración Glomerular
        vfg: /VFG\s\D*(\d+\.?\d*)\s*mL\/min/i,

        // BUN (Nitrógeno Ureico): busca "NITROGENO UREICO (BUN)" seguido de números
        bun: /NITROGENO UREICO \(BUN\)\s*[hi]*\s*(\d+\.?\d*)\s*mg%/i,

        // Urea: busca "UREA" seguido de números y "mg/dL"
        urea: /UREA\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // Sodio: busca "ELECTROLITO SODIO" seguido de números y "mEq/L"
        sodio: /ELECTROLITO SODIO\s*[hi]*\s*(\d+\.?\d*)\s*mEq\/L/i,

        // Potasio: busca "ELECTROLITO POTASIO" seguido de números y "mEq/L"
        potasio: /ELECTROLITO POTASIO\s*[hi]*\s*(\d+\.?\d*)\s*mEq\/L/i,

        // Cloro: busca "ELECTROLITO CLORO" seguido de números y "mEq/L"
        cloro: /ELECTROLITO CLORO\s*[hi]*\s*(\d+\.?\d*)\s*mEq\/L/i,

        // Fósforo: busca "FOSFORO SERICO" seguido de números y "mg/dL"
        fosforo: /FOSFORO SERICO\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // Calcio: busca "CALCIO" seguido de números y "mg/dL"
        calcio: /CALCIO\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // Magnesio: busca "MAGNESIO" seguido de números y "mg/dL"
        magnesio: /MAGNESIO\s*[hi]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // Ácido Úrico
        acido_urico: /ACIDO\s+URICO\s\D*(\d+\.?\d*)\s*mg\/dL/i
    },

    // ============== FUNCIÓN HEPÁTICA ==============
    hepatico: {
        // Bilirrubina Total: busca "Bilirrubina Total" seguido de números
        bilirrubina_total: /(?:Bilirrubina Total|BILIRRUBINA TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // Bilirrubina Directa: busca "Bilirrubina Directa" o "BILIRRUBINA DIRECTA" seguido de números
        bilirrubina_directa: /(?:Bilirrubina Directa|BILIRRUBINA DIRECTA)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // GOT/ASAT: múltiples patrones para transaminasas
        got_asat: [
            /ASPARTATO AMINO TRANSFERASA[\s\S]*?\(ASAT\/GOT\)[\s\S]*?(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GOT\/ASAT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GOT|ASAT)\s*\*?\s*(\d+\.?\d*)\s*U\/L/i
        ],

        // GPT/ALT: múltiples patrones para transaminasas
        gpt_alt: [
            /ALANINA AMINO TRANSFERASA[\s\S]*?\(ALAT\/GPT\)[\s\S]*?[hi]*\s*(\d+\.?\d*)\s*U\/L/i,
            /Transaminasa GPT\/\s?ALT\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /(?:GPT|ALT)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],

        // Fosfatasa Alcalina: busca "Fosfatasa Alcalina" o "FOSFATASAS ALCALINAS"
        fosfatasa_alcalina: /(?:Fosfatasa Alcalina|FOSFATASAS ALCALINAS)\s*[hi*]*\s*(\d+\.?\d*)\s*U\/L/i,

        // GGT: busca "Gamma Glutamiltranspeptidasa" o "GAMAGLUTAMIL TRANSFERASA (GGT)"
        ggt: [
            /Gamma Glutamiltranspeptidasa\s*\*?\s*(\d+\.?\d*)\s*U\/L/i,
            /GAMAGLUTAMIL TRANSFERASA \(GGT\)\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
        ],

        // Amilasa: busca "AMILASA"
        amilasa: /AMILASA\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i,

        // Lipasa: busca "LIPASA"
        lipasa: /LIPASA\s*[hi]*\s*(\d+\.?\d*)\s*U\/L/i
    },

    // ============== NUTRICIONAL ==============
    nutricional: {
        // Proteínas: busca "Proteínas" o "PROTEINAS TOTALES"
        proteinas: /(?:Proteínas|PROTEINAS TOTALES)\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,

        // Albúmina: busca "Albúmina" o "ALBUMINA"
        albumina: /(?:Albúmina|ALBUMINA)\s*[hi*]*\s*(\d+\.?\d*)\s*g\/dL/i,

        // Prealbúmina: busca "Prealbúmina", "Prealbumina" o "PRE-ALBUMINA", soportando "i" o "h" intermedios
        prealbumin: /(?:Prealbúmina|Prealbumina|PRE-ALBUMINA)\s*[hi*]*\s*(\d+\.?\d*)/i,

        // Colesterol Total: busca "Colesterol Total" o "COLESTEROL TOTAL"
        colesterol_total: /(?:Colesterol Total|COLESTEROL TOTAL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // LDL: busca "Colesterol LDL" o "LDL" regex flexible
        ldl: /(?:Colesterol LDL|LDL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i,

        // HDL: busca "Colesterol HDL" o "HDL" regex flexible
        hdl: /(?:Colesterol HDL|HDL)\s*[hi*]*\s*(\d+\.?\d*)\s*mg\/dL/i
    },

    // ============== PCR Y MARCADORES INFLAMATORIOS ==============
    pcr: {
        // PCR: múltiples patrones para Proteína C Reactiva
        pcr: [
            /PROTEINA\s+C\s+REACTIVA\s*\(?CRP\)?\s*[hi*]*\s*(\d+\.?\d*)\s+mg\/L/i,
            /Proteína\s+C\s+Reactiva\s*\*?\s*(\d+\.?\d*)\s+mg\/L/i
        ],

        // Procalcitonina: busca "Procalcitonina"
        procalcitonina: /Procalcitonina\s*\*?\s*(\d+\.?\d*)\s+ng\/mL/i,

        // VHS: busca "VHS" o "Velocidad de Sedimentación"
        vhs: /(?:VHS|Velocidad\s+de\s+Sedimentación)\s*\*?\s*(\d+\.?\d*)\s*mm\/hr?/i
    },

    // ============== COAGULACIÓN ==============
    coagulacion: {
        // INR: busca "INR" seguido de números
        inr: /INR\s*[hi]*\s*(\d+\.?\d*)/i,

        // Tiempo de Protrombina: busca "TIEMPO DE PROTROMBINA" con segundos
        tiempo_protrombina: /TIEMPO DE PROTROMBINA\s*[hi]*\s*(\d+\.?\d*)\s*Segundos/i,

        // %TP: busca "% TP" 
        porcentaje_tp: /%\s*TP\s*[hi]*\s*(\d+\.?\d*)\s*%/i,

        // TTPA: busca "TIEMPO DE TROMBOPLASTINA PARCIAL ACTIVADO"
        ttpa: /TIEMPO DE TROMBOPLASTINA PARCIAL\s+ACTIVADO\s*[hi]*\s*(\d+\.?\d*)\s*Segundos/i
    },

    // ============== GASES EN SANGRE ==============
    gases: {
        // pH: busca "pH" específicamente (no parte de otra palabra)
        ph: /\bpH\s*[hi]*\s*(\d+\.?\d*)/i,

        // PCO2: busca "PCO2"
        pco2: /PCO2[\s\S]*?(\d+\.?\d*)\s+mmHg/i,

        // HCO3: busca "HCO3"
        hco3: /HCO3[\s\S]*?(\d+\.?\d*)\s+mmol\/L/i,

        // Saturación de O2: busca "Saturación O2"
        saturacion_o2: /%\s+Saturación\s+O2[\s\S]*?(\d+\.?\d*)\s+%/i
    },

    // ============== FECHAS ==============
    fechas: {
        // Múltiples patrones para extraer fechas
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
