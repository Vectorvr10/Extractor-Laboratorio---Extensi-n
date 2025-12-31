// EXTRACTORES MÉDICOS SIMPLIFICADOS
// Cada función es independiente y fácil de modificar

class SimpleExtractor {
    constructor() {
        this.texto = '';
        this.formatOptions = {
            usarDosPuntos: true,
            usarMayusculas: false,
            usarSaltosLinea: true
        };
    }

    // Configura las opciones de formato
    setFormatOptions(options) {
        this.formatOptions = { ...this.formatOptions, ...options };
    }

    // Formatea una etiqueta con valor según las opciones
    formatearEtiqueta(etiqueta, valor) {
        let label = this.formatOptions.usarMayusculas ? etiqueta.toUpperCase() : etiqueta;
        let separador = this.formatOptions.usarDosPuntos ? ': ' : ' ';
        return `${label}${separador}${valor}`;
    }

    // Formatea etiqueta compuesta (ej: GOT/GPT)
    formatearEtiquetaCompuesta(etiqueta, valor1, valor2) {
        let label = this.formatOptions.usarMayusculas ? etiqueta.toUpperCase() : etiqueta;
        let separador = this.formatOptions.usarDosPuntos ? ': ' : ' ';
        return `${label}${separador}${valor1}/${valor2}`;
    }

    // Función auxiliar para limpiar asteriscos
    limpiarAsteriscos(texto) {
        return texto.replace(/\* /g, '*');
    }

    // Función auxiliar para formatear números
    formatearNumero(valor) {
        if (!valor) return valor;

        const numero = parseFloat(valor);
        if (isNaN(numero)) return valor;

        // Si es menor que 10 y tiene decimales, mantener 1 decimal
        if (numero < 10 && numero % 1 !== 0) {
            return numero.toFixed(1);
        }
        // Si es mayor o igual a 10, redondear a entero
        return Math.round(numero).toString();
    }

    // ============== EXTRACTOR DE HEMOGRAMA ==============
    extraerHemograma(opcionesSeleccionadas = []) {
        let resultados = [];

        // 1. HEMOGLOBINA
        // 1. HEMOGLOBINA
        const hb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hemoglobina);
        if (hb) {
            const hbFormateado = parseFloat(hb).toFixed(1);
            const hbLabel = (this.formatOptions.usarHb !== false) ? 'Hb' : 'Hg';
            resultados.push(this.formatearEtiqueta(hbLabel, hbFormateado));
        }

        // 2. NEUTRÓFILOS % (se usará con GB)
        const neutrofilos = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.neutrofilos_porcentaje);
        let neutrofiloPart = '';
        if (neutrofilos) {
            const neutRedondeado = Math.round(parseFloat(neutrofilos));
            const labelN = this.formatOptions.usarMayusculas ? 'N' : 'N';
            const sepN = this.formatOptions.usarDosPuntos ? ': ' : ' ';
            neutrofiloPart = ` (${labelN}${sepN}${neutRedondeado}%)`;
        }

        // 3. LEUCOCITOS (Glóbulos Blancos) + NEUTRÓFILOS
        const gb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.leucocitos);
        if (gb) {
            const gbFormateado = parseFloat(gb).toFixed(3);
            resultados.push(this.formatearEtiqueta('GB', gbFormateado) + neutrofiloPart);
        }

        // 4. PLAQUETAS
        const plaquetas = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.plaquetas);
        if (plaquetas) {
            resultados.push(this.formatearEtiqueta('Plaq', `${plaquetas}.000`));
        }

        // === PARÁMETROS ADICIONALES DEL SUBMENÚ ===

        // HEMATOCRITO (Hcto)
        if (opcionesSeleccionadas.includes('Hcto')) {
            const hcto = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hematocrito);
            if (hcto) {
                const hctoFormateado = Math.round(parseFloat(hcto));
                resultados.push(this.formatearEtiqueta('Hcto', `${hctoFormateado}%`));
            }
        }

        // VCM
        if (opcionesSeleccionadas.includes('VCM')) {
            const vcm = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.vcm);
            if (vcm) {
                const vcmFormateado = Math.round(parseFloat(vcm));
                resultados.push(this.formatearEtiqueta('VCM', vcmFormateado));
            }
        }

        // CHCM
        if (opcionesSeleccionadas.includes('CHCM')) {
            const chcm = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.chcm);
            if (chcm) {
                const chcmFormateado = Math.round(parseFloat(chcm));
                resultados.push(this.formatearEtiqueta('CHCM', chcmFormateado));
            }
        }

        // RDW
        if (opcionesSeleccionadas.includes('RDW')) {
            const rdw = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.rdw);
            if (rdw) {
                const rdwFormateado = Math.round(parseFloat(rdw));
                resultados.push(this.formatearEtiqueta('RDW', rdwFormateado));
            }
        }

        // RETICULOCITOS
        if (opcionesSeleccionadas.includes('Reticulocitos')) {
            const retic = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.reticulocitos);
            if (retic) {
                resultados.push(this.formatearEtiqueta('Ret', `${retic}%`));
            }
        }

        // LINFOCITOS %
        if (opcionesSeleccionadas.includes('Linfocitos')) {
            const linf = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.linfocitos_porcentaje);
            if (linf) {
                const linfFormateado = Math.round(parseFloat(linf));
                resultados.push(this.formatearEtiqueta('L', `${linfFormateado}%`));
            }
        }

        // RAN (Recuento Absoluto de Neutrófilos)
        if (opcionesSeleccionadas.includes('RAN')) {
            const ran = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.neutrofilos_absoluto);
            if (ran) {
                const ranFormateado = parseFloat(ran).toFixed(3);
                resultados.push(this.formatearEtiqueta('RAN', ranFormateado));
            }
        }

        // RAL (Recuento Absoluto de Linfocitos)
        if (opcionesSeleccionadas.includes('RAL')) {
            const ral = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.linfocitos_absoluto);
            if (ral) {
                const ralFormateado = parseFloat(ral).toFixed(3);
                resultados.push(this.formatearEtiqueta('RAL', ralFormateado));
            }
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FUNCIÓN RENAL ==============
    extraerRenal(opcionesSeleccionadas = []) {
        let resultados = [];

        const creatinina = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.creatinina);
        if (creatinina) {
            let creaFormateada = parseFloat(creatinina).toFixed(1);

            // VFG (Velocidad de Filtración Glomerular)
            if (opcionesSeleccionadas.includes('VFG')) {
                const vfg = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.vfg);
                if (vfg) {
                    const vfgFormateado = Math.round(parseFloat(vfg));
                    const sepVfg = this.formatOptions.usarDosPuntos ? ': ' : ' ';
                    creaFormateada += ` (VFG${sepVfg}${vfgFormateado})`;
                }
            }

            resultados.push(this.formatearEtiqueta('Crea', creaFormateada));
        }

        // 2. BUN (Nitrógeno Ureico) - siempre incluido
        const bun = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.bun);
        if (bun) {
            resultados.push(this.formatearEtiqueta('BUN', bun));
        }

        // 3. UREA (solo si está seleccionada en el submenú)
        if (opcionesSeleccionadas.includes('Urea')) {
            const urea = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.urea);
            if (urea) {
                const ureaRedondeada = Math.round(parseFloat(urea));
                resultados.push(this.formatearEtiqueta('Urea', ureaRedondeada));
            }
        }

        // 4. ELECTROLITOS (Na/K/Cl)
        const sodio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.sodio);
        const potasio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.potasio);
        const cloro = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.cloro);

        if (sodio && potasio && cloro) {
            const naRedondeado = Math.round(parseFloat(sodio));
            const kFormateado = parseFloat(potasio).toFixed(1);
            const clRedondeado = Math.round(parseFloat(cloro));
            resultados.push(this.formatearEtiqueta('ELP', `${naRedondeado}/${kFormateado}/${clRedondeado}`));
        }

        // 5. FÓSFORO (sin redondear)
        const fosforo = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.fosforo);
        if (fosforo) {
            resultados.push(this.formatearEtiqueta('P', fosforo));
        }

        // 6. CALCIO (1 decimal)
        const calcio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.calcio);
        if (calcio) {
            const caFormateado = parseFloat(calcio).toFixed(1);
            resultados.push(this.formatearEtiqueta('Ca', caFormateado));
        }

        // === PARÁMETROS ADICIONALES DEL SUBMENÚ ===

        // 7. MAGNESIO (solo si está seleccionado)
        if (opcionesSeleccionadas.includes('Magnesio')) {
            const magnesio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.magnesio);
            if (magnesio) {
                resultados.push(this.formatearEtiqueta('Mg', magnesio));
            }
        }

        // 8. ÁCIDO ÚRICO (solo si está seleccionado)
        if (opcionesSeleccionadas.includes('AcidoUrico') || opcionesSeleccionadas.includes('Ácido Úrico') || opcionesSeleccionadas.includes('Acido Úrico')) {
            const acidoUrico = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.acido_urico);
            if (acidoUrico) {
                const auFormateado = parseFloat(acidoUrico).toFixed(1);
                resultados.push(this.formatearEtiqueta('Á.Ur', auFormateado));
            }
        }

        // 8. AMILASA (redondear a entero)
        const amilasa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.amilasa);
        if (amilasa) {
            const amilFormateada = Math.round(parseFloat(amilasa));
            resultados.push(this.formatearEtiqueta('Amil', amilFormateada));
        }

        // 9. LIPASA (redondear a entero)
        const lipasa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.lipasa);
        if (lipasa) {
            const lipFormateada = Math.round(parseFloat(lipasa));
            resultados.push(this.formatearEtiqueta('Lip', lipFormateada));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FUNCIÓN HEPÁTICA ==============
    extraerHepatico() {
        let resultados = [];

        // 1. BILIRRUBINA TOTAL/DIRECTA -> BiliT/D: 0.49/0.38
        const biliT = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_total);
        const biliD = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_directa);
        if (biliT || biliD) {
            const bt = biliT ? biliT : '--';
            const bd = biliD ? biliD : '--';
            resultados.push(this.formatearEtiquetaCompuesta('BiliT/D', bt, bd));
        }

        // 2. GOT/GPT (Transaminasas) - sin decimales
        const got = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.got_asat);
        const gpt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.gpt_alt);

        if (got && gpt) {
            const gotFormateado = Math.round(parseFloat(got));
            const gptFormateado = Math.round(parseFloat(gpt));
            resultados.push(this.formatearEtiquetaCompuesta('GOT/GPT', gotFormateado, gptFormateado));
        } else if (got) {
            const gotFormateado = Math.round(parseFloat(got));
            resultados.push(this.formatearEtiqueta('GOT', gotFormateado));
        } else if (gpt) {
            const gptFormateado = Math.round(parseFloat(gpt));
            resultados.push(this.formatearEtiqueta('GPT', gptFormateado));
        }

        // 3. FOSFATASA ALCALINA
        const fa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.fosfatasa_alcalina);
        if (fa) {
            const faFormateada = Math.round(parseFloat(fa));
            resultados.push(this.formatearEtiqueta('FA', faFormateada));
        }

        // 4. GGT
        const ggt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.ggt);
        if (ggt) {
            const ggtFormateada = Math.round(parseFloat(ggt));
            resultados.push(this.formatearEtiqueta('GGT', ggtFormateada));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE PCR Y MARCADORES INFLAMATORIOS ==============
    extraerPCR() {
        let resultados = [];

        // 1. PCR (Proteína C Reactiva) - redondear a entero
        const pcr = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.pcr);
        if (pcr) {
            const pcrFormateada = Math.round(parseFloat(pcr));
            resultados.push(this.formatearEtiqueta('PCR', pcrFormateada));
        }

        // 2. PROCALCITONINA
        const procalcitonina = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.procalcitonina);
        if (procalcitonina) {
            resultados.push(this.formatearEtiqueta('Proca', procalcitonina));
        }

        // 3. VHS (Velocidad de Sedimentación)
        const vhs = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.vhs);
        if (vhs) {
            resultados.push(this.formatearEtiqueta('VHS', vhs));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE COAGULACIÓN ==============
    extraerCoagulacion() {
        let resultados = [];

        // 1. INR (1 decimal)
        const inr = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.inr);
        if (inr) {
            const inrFormateado = parseFloat(inr).toFixed(1);
            resultados.push(this.formatearEtiqueta('INR', inrFormateado));
        }

        // 2. TIEMPO DE PROTROMBINA + %TP
        const pt = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.tiempo_protrombina);
        const ptPct = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.porcentaje_tp);
        if (pt) {
            const ptSeg = Math.round(parseFloat(pt));
            const pctPart = ptPct ? ` (${Math.round(parseFloat(ptPct))}%)` : '';
            resultados.push(this.formatearEtiqueta('TP', `${ptSeg}s${pctPart}`));
        }

        // 3. TTPA
        const ttpa = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.ttpa);
        if (ttpa) {
            const ttpaFormateado = Math.round(parseFloat(ttpa));
            resultados.push(this.formatearEtiqueta('TTPa', `${ttpaFormateado}s`));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR NUTRICIONAL ==============
    extraerNutricional(opcionesSeleccionadas = []) {
        let resultados = [];

        // 1. PROTEÍNAS TOTALES
        const proteinas = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.proteinas);
        if (proteinas) {
            resultados.push(this.formatearEtiqueta('Prot', proteinas));
        }

        // 2. ALBÚMINA
        const albumina = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.albumina);
        if (albumina) {
            resultados.push(this.formatearEtiqueta('Alb', albumina));
        }

        // 3. PREALBÚMINA (hasta 2 decimales)
        const prealbumin = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.prealbumin);
        if (prealbumin) {
            // Eliminar decimales extra si tiene más de 2, pero mantener si tiene 1 o 2
            const prealbVal = parseFloat(prealbumin);
            // Máximo 2 decimales, pero toString para eliminar ceros innecesarios si es entero
            const prealbFormateado = Number(prealbVal.toFixed(2)).toString();
            resultados.push(this.formatearEtiqueta('PreAlb', prealbFormateado));
        }

        // 4. COLESTEROL TOTAL (sin decimales)
        // Verificar si existe la opción en opcionesSeleccionadas, si no, intentar extraerlo igual si está presente en "Nutricional" general
        const colT = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.colesterol_total);
        if (colT && (opcionesSeleccionadas.includes('ColT') || opcionesSeleccionadas.includes('Nutricional'))) {
            const colTFormateado = Math.round(parseFloat(colT));
            resultados.push(this.formatearEtiqueta('ColT', colTFormateado));
        }

        // 5. LDL (sin decimales)
        const ldl = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.ldl);
        if (ldl && (opcionesSeleccionadas.includes('LDL') || opcionesSeleccionadas.includes('Nutricional'))) {
            const ldlFormateado = Math.round(parseFloat(ldl));
            resultados.push(this.formatearEtiqueta('LDL', ldlFormateado));
        }

        // 6. HDL (sin decimales)
        const hdl = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.hdl);
        if (hdl && (opcionesSeleccionadas.includes('HDL') || opcionesSeleccionadas.includes('Nutricional'))) {
            const hdlFormateado = Math.round(parseFloat(hdl));
            resultados.push(this.formatearEtiqueta('HDL', hdlFormateado));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE GASES EN SANGRE ==============
    extraerGases() {
        let resultados = [];

        // 1. pH
        const ph = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.ph);
        if (ph) {
            resultados.push(this.formatearEtiqueta('pH', ph));
        }

        // 2. PCO2
        const pco2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.pco2);
        if (pco2) {
            resultados.push(this.formatearEtiqueta('pCO2', pco2));
        }

        // 3. HCO3
        const hco3 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.hco3);
        if (hco3) {
            resultados.push(this.formatearEtiqueta('HCO3', hco3));
        }

        // 4. SATURACIÓN O2
        const satO2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.saturacion_o2);
        if (satO2) {
            resultados.push(this.formatearEtiqueta('SatO2', satO2));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FECHA ==============
    extraerFecha() {
        // Probar todos los patrones de fecha
        for (let patron of EXTRACTION_PATTERNS.fechas.patrones) {
            let coincidencia = this.texto.match(patron);
            if (coincidencia) {
                let fechaCompleta = coincidencia[1];
                // Normalizar separadores y split
                const fechaLimpia = fechaCompleta.replace(/-/g, '/');
                const partes = fechaLimpia.split('/');

                if (partes.length === 3) {
                    const dia = partes[0].padStart(2, '0');
                    const mes = partes[1].padStart(2, '0');
                    let anio = partes[2];

                    // Normalizar a 4 dígitos si viene en 2
                    if (anio.length === 2) anio = '20' + anio;

                    const format = this.formatOptions.dateFormat || 'dd/mm/yyyy';
                    let fechaStr = '';

                    if (format === 'dd/mm') {
                        fechaStr = `${dia}/${mes}`;
                    } else if (format === 'dd/mm/yy') {
                        fechaStr = `${dia}/${mes}/${anio.substring(2)}`;
                    } else {
                        // Default dd/mm/yyyy
                        fechaStr = `${dia}/${mes}/${anio}`;
                    }

                    // Siempre agregar dos puntos para la fecha, independiente de la configuración general
                    return `${fechaStr}:`;
                }

                // Fallback: intentar extraer solo dd/mm si el parseo falla pero hubo match
                return fechaCompleta.substring(0, 5) + ':';
            }
        }
        return '';
    }

    // ============== FUNCIÓN PRINCIPAL ==============
    procesar(texto, opcionesSeleccionadas) {
        this.texto = texto;
        let lineas = [];

        // Agregar fecha si está seleccionada
        let fecha = '';
        if (opcionesSeleccionadas.includes('Fecha')) {
            fecha = this.extraerFecha();
        }

        // Procesar cada tipo de examen seleccionado
        // Procesar cada tipo de examen seleccionado en el ORDEN EN QUE LLEGAN (DOM Order)
        let secciones = [];

        // Iterar sobre las opciones seleccionadas para respetar el orden visual
        opcionesSeleccionadas.forEach(opcion => {
            if (opcion === 'Hemograma') {
                const hemograma = this.extraerHemograma(opcionesSeleccionadas);
                if (hemograma) secciones.push(hemograma);
            } else if (opcion === 'PCR') {
                const pcr = this.extraerPCR();
                if (pcr) secciones.push(pcr);
            } else if (opcion === 'Renal') {
                const renal = this.extraerRenal(opcionesSeleccionadas);
                if (renal) secciones.push(renal);
            } else if (opcion === 'Hepático' || opcion === 'Hepatico') {
                const hepatico = this.extraerHepatico();
                if (hepatico) secciones.push(hepatico);
            } else if (opcion === 'Coagulación' || opcion === 'Coagulacion') {
                const coagulacion = this.extraerCoagulacion();
                if (coagulacion) secciones.push(coagulacion);
            } else if (opcion === 'Nutricional') {
                const nutricional = this.extraerNutricional(opcionesSeleccionadas);
                if (nutricional) secciones.push(nutricional);
            } else if (opcion === 'Gases') {
                const gases = this.extraerGases();
                if (gases) secciones.push(gases);
            }
        });

        // Formatear el resultado según el patrón esperado
        if (secciones.length === 0) {
            return fecha ? fecha : 'No se encontraron datos';
        }

        // Organizar las secciones en líneas específicas según el patrón esperado
        const resultado = this.formatearResultadoEstructurado(fecha, secciones);
        return resultado;
    }

    // Función auxiliar para formatear el resultado con estructura específica
    formatearResultadoEstructurado(fecha, secciones) {
        // Usar caracter especial que simula Shift+Enter en procesadores de texto
        const SOFT_LINE_BREAK = '\u2028'; // Line Separator Unicode - equivale a Shift+Enter

        // Determinar separador según opción de saltos de línea
        const separadorLineas = this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ', ';

        let resultado = fecha ? fecha + (this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ' ') : '';

        // Organizar secciones secuencialmente respetando el orden del array
        const separador = this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ', ';

        // Si hay saltos de línea, asegurar que cada sección termine con limpieza.
        // Si es una sola línea, unir con comas.

        resultado += secciones.join(separador);

        return resultado;
    }
}

// Exportar para uso en script.js
window.SimpleExtractor = SimpleExtractor;
