// EXTRACTORES MÉDICOS SIMPLIFICADOS
// Cada función es independiente y fácil de modificar

class SimpleExtractor {
    constructor() {
        this.texto = '';
        this.formatOptions = {
            usarDosPuntos: true,
            usarMayusculas: false,
            usarSaltosLinea: true,
            usarRedondear: false
        };
    }

    setFormatOptions(options) {
        this.formatOptions = { ...this.formatOptions, ...options };
    }

    formatearEtiqueta(etiqueta, valor) {
        let label = this.formatOptions.usarMayusculas ? etiqueta.toUpperCase() : etiqueta;
        let separador = this.formatOptions.usarDosPuntos ? ': ' : ' ';
        return `${label}${separador}${valor}`;
    }

    formatearEtiquetaCompuesta(etiqueta, valor1, valor2) {
        let label = this.formatOptions.usarMayusculas ? etiqueta.toUpperCase() : etiqueta;
        let separador = this.formatOptions.usarDosPuntos ? ': ' : ' ';
        return `${label}${separador}${valor1}/${valor2}`;
    }

    limpiarAsteriscos(texto) {
        return texto.replace(/\* /g, '*');
    }

    limpiarCerosDecimales(numeroStr, mantenerCeros = false) {
        if (mantenerCeros) {
            return numeroStr;
        }
        
        let resultado = numeroStr.replace(/(\.[0-9]*?)0+$/, '$1');
        resultado = resultado.replace(/\.$/, '');
        return resultado;
    }

    formatearNumeroConDecimales(valor, decimales, mantenerCeros = false, esPorcentaje = false, redondeoEspecial = 'normal') {
        if (!valor) return valor;

        const numero = parseFloat(valor);
        if (isNaN(numero)) return valor;

        if (this.formatOptions.usarRedondear) {
            if (esPorcentaje) {
                return Math.round(numero).toString();
            }
            
            if (redondeoEspecial === 'unidad') {
                return Math.round(numero).toString();
            }
            
            if (redondeoEspecial === 'unidad_decimal') {
                return Math.round(numero).toString();
            }
            
            if (redondeoEspecial === 'crea') {
                const redondeado = Math.round(numero * 10) / 10;
                let resultado = redondeado.toFixed(1);
                resultado = this.limpiarCerosDecimales(resultado, mantenerCeros);
                return resultado;
            }
            
            if (redondeoEspecial === 'inr') {
                const redondeado = Math.round(numero * 10) / 10;
                let resultado = redondeado.toFixed(1);
                resultado = this.limpiarCerosDecimales(resultado, mantenerCeros);
                return resultado;
            }
            
            if (decimales === 0) {
                return Math.round(numero).toString();
            } else {
                const multiplicador = Math.pow(10, decimales);
                const redondeado = Math.round(numero * multiplicador) / multiplicador;
                let resultado = redondeado.toFixed(decimales);
                
                resultado = this.limpiarCerosDecimales(resultado, mantenerCeros);
                return resultado;
            }
        } else {
            if (decimales === 0) {
                return Math.floor(numero).toString();
            } else {
                if (mantenerCeros) {
                    return numero.toFixed(decimales);
                } else {
                    const multiplicador = Math.pow(10, decimales);
                    const truncado = Math.floor(numero * multiplicador) / multiplicador;
                    
                    let resultado = truncado.toString();
                    
                    if (resultado.includes('.')) {
                        const partes = resultado.split('.');
                        if (partes[1].length > decimales) {
                            partes[1] = partes[1].substring(0, decimales);
                        }
                        resultado = partes.join('.');
                    }
                    
                    resultado = this.limpiarCerosDecimales(resultado, false);
                    return resultado;
                }
            }
        }
    }

    formatearNumero(valor) {
        return this.formatearNumeroConDecimales(valor, 3, false);
    }

    // ============== EXTRACTOR DE HEMOGRAMA ==============
    extraerHemograma(opcionesSeleccionadas = []) {
        let resultados = [];

        // 1. HEMOGLOBINA
        const hb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hemoglobina);
        if (hb) {
            let hbFormateado = this.formatearNumeroConDecimales(hb, 1, false);
            const hbLabel = (this.formatOptions.usarHb !== false) ? 'Hb' : 'Hg';
            resultados.push(this.formatearEtiqueta(hbLabel, hbFormateado));
        }

        // 2. NEUTRÓFILOS % 
        const neutrofilos = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.neutrofilos_porcentaje);
        let neutrofiloPart = '';
        if (neutrofilos) {
            let neutFormateado = this.formatearNumeroConDecimales(neutrofilos, 0, false, true);
            const labelN = this.formatOptions.usarMayusculas ? 'N' : 'N';
            const sepN = this.formatOptions.usarDosPuntos ? ': ' : ' ';
            neutrofiloPart = ` (${labelN}${sepN}${neutFormateado}%)`;
        }

        // 3. LEUCOCITOS (Glóbulos Blancos)
        const gb = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.leucocitos);
        if (gb) {
            let gbFormateado = this.formatearNumeroConDecimales(gb, 3, true); 
            // Determinar etiqueta según configuración
            const gbLabel = (this.formatOptions.usarGB !== false) ? 'GB' : 'Leuco';
            resultados.push(this.formatearEtiqueta(gbLabel, gbFormateado) + neutrofiloPart);
        }

        // 4. PLAQUETAS
        const plaquetas = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.plaquetas);
        if (plaquetas) {
            let plaquetasNum = parseFloat(plaquetas);
            if (!isNaN(plaquetasNum)) {
                let plaquetasFormateado = this.formatearNumeroConDecimales(plaquetasNum, 0, true);
                resultados.push(this.formatearEtiqueta('Plaq', `${plaquetasFormateado}.000`));
            }
        }

        // === PARÁMETROS ADICIONALES DEL SUBMENÚ ===

        // HEMATOCRITO (Hcto)
        if (opcionesSeleccionadas.includes('Hcto')) {
            const hcto = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.hematocrito);
            if (hcto) {
                let hctoFormateado = this.formatearNumeroConDecimales(hcto, 1, false, true);
                resultados.push(this.formatearEtiqueta('Hcto', `${hctoFormateado}%`));
            }
        }

        // VCM
        if (opcionesSeleccionadas.includes('VCM')) {
            const vcm = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.vcm);
            if (vcm) {
                let vcmFormateado = this.formatearNumeroConDecimales(vcm, 1, false, false, 'unidad_decimal'); 
                resultados.push(this.formatearEtiqueta('VCM', vcmFormateado));
            }
        }

        // CHCM 
        if (opcionesSeleccionadas.includes('CHCM')) {
            const chcm = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.chcm);
            if (chcm) {
                let chcmFormateado = this.formatearNumeroConDecimales(chcm, 1, false, false, 'unidad_decimal');
                resultados.push(this.formatearEtiqueta('CHCM', chcmFormateado));
            }
        }

        // RDW 
        if (opcionesSeleccionadas.includes('RDW')) {
            const rdw = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.rdw);
            if (rdw) {
                let rdwFormateado = this.formatearNumeroConDecimales(rdw, 1, false, false, 'unidad_decimal'); 
                resultados.push(this.formatearEtiqueta('RDW', rdwFormateado));
            }
        }

        // RETICULOCITOS 
        if (opcionesSeleccionadas.includes('Reticulocitos')) {
            const retic = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.reticulocitos);
            if (retic) {
                let reticFormateado = this.formatearNumeroConDecimales(retic, 0, false, true);
                resultados.push(this.formatearEtiqueta('Ret', `${reticFormateado}%`));
            }
        }

        // LINFOCITOS % (L) 
        if (opcionesSeleccionadas.includes('Linfocitos')) {
            const linf = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.linfocitos_porcentaje);
            if (linf) {
                let linfFormateado = this.formatearNumeroConDecimales(linf, 1, false, true); 
                resultados.push(this.formatearEtiqueta('L', `${linfFormateado}%`));
            }
        }

        // RAN (Recuento Absoluto de Neutrófilos) 
        if (opcionesSeleccionadas.includes('RAN')) {
            const ran = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.neutrofilos_absoluto);
            if (ran) {
                let ranFormateado = this.formatearNumeroConDecimales(ran, 3, true);
                resultados.push(this.formatearEtiqueta('RAN', ranFormateado));
            }
        }

        // RAL (Recuento Absoluto de Linfocitos) 
        if (opcionesSeleccionadas.includes('RAL')) {
            const ral = extraerValor(this.texto, EXTRACTION_PATTERNS.hemograma.linfocitos_absoluto);
            if (ral) {
                let ralFormateado = this.formatearNumeroConDecimales(ral, 3, true); 
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
            let creaFormateada = this.formatearNumeroConDecimales(creatinina, 2, false, false, 'crea'); 

            // VFG (Velocidad de Filtración Glomerular) 
            if (opcionesSeleccionadas.includes('VFG')) {
                const vfg = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.vfg);
                if (vfg) {
                    let vfgFormateado = this.formatearNumeroConDecimales(vfg, 1, false, false, 'unidad_decimal'); 
                    const sepVfg = this.formatOptions.usarDosPuntos ? ': ' : ' ';
                    creaFormateada += ` (VFG${sepVfg}${vfgFormateado})`;
                }
            }

            resultados.push(this.formatearEtiqueta('Crea', creaFormateada));
        }

        // 2. BUN (Nitrógeno Ureico) 
        const bun = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.bun);
        if (bun) {
            let bunFormateado = this.formatearNumeroConDecimales(bun, 1, false, false, 'unidad_decimal'); 
            resultados.push(this.formatearEtiqueta('BUN', bunFormateado));
        }

        // 3. UREA
        if (opcionesSeleccionadas.includes('Urea')) {
            const urea = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.urea);
            if (urea) {
                let ureaFormateada = this.formatearNumeroConDecimales(urea, 1, false, false, 'unidad_decimal'); 
                resultados.push(this.formatearEtiqueta('Urea', ureaFormateada));
            }
        }

        // 4. ELECTROLITOS (Na/K/Cl)
        const sodio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.sodio);
        const potasio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.potasio);
        const cloro = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.cloro);

        if (sodio && potasio && cloro) {
            let naFormateado = this.formatearNumeroConDecimales(sodio, 1, false);  
            let kFormateado = this.formatearNumeroConDecimales(potasio, 1, false); 
            let clFormateado = this.formatearNumeroConDecimales(cloro, 1, false); 
            
            const elpLabel = (this.formatOptions.usarELP !== false) ? 'ELP' : 'Na/K/Cl';
            
            resultados.push(this.formatearEtiqueta(elpLabel, `${naFormateado}/${kFormateado}/${clFormateado}`));
        }

        // 5. FÓSFORO
        const fosforo = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.fosforo);
        if (fosforo) {
            let fosforoFormateado = this.formatearNumeroConDecimales(fosforo, 1, false);
            resultados.push(this.formatearEtiqueta('P', fosforoFormateado));
        }

        // 6. CALCIO 
        const calcio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.calcio);
        if (calcio) {
            let caFormateado = this.formatearNumeroConDecimales(calcio, 1, false);
            resultados.push(this.formatearEtiqueta('Ca', caFormateado));
        }

        // === PARÁMETROS ADICIONALES DEL SUBMENÚ ===

        // 7. MAGNESIO 
        if (opcionesSeleccionadas.includes('Magnesio')) {
            const magnesio = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.magnesio);
            if (magnesio) {
                let magnesioFormateado = this.formatearNumeroConDecimales(magnesio, 1, false);
                resultados.push(this.formatearEtiqueta('Mg', magnesioFormateado));
            }
        }

        // 8. ÁCIDO ÚRICO 
        if (opcionesSeleccionadas.includes('AcidoUrico') || opcionesSeleccionadas.includes('Ácido Úrico') || opcionesSeleccionadas.includes('Acido Úrico')) {
            const acidoUrico = extraerValor(this.texto, EXTRACTION_PATTERNS.renal.acido_urico);
            if (acidoUrico) {
                let auFormateado = this.formatearNumeroConDecimales(acidoUrico, 2, false);
                resultados.push(this.formatearEtiqueta('Á.Ur', auFormateado));
            }
        }

        // 8. AMILASA
        const amilasa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.amilasa);
        if (amilasa) {
            let amilFormateada = this.formatearNumeroConDecimales(amilasa, 1, false, false, 'unidad_decimal');
            resultados.push(this.formatearEtiqueta('Amil', amilFormateada));
        }

        // 9. LIPASA 
        const lipasa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.lipasa);
        if (lipasa) {
            let lipFormateada = this.formatearNumeroConDecimales(lipasa, 1, false, false, 'unidad_decimal');
            resultados.push(this.formatearEtiqueta('Lip', lipFormateada));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FUNCIÓN HEPÁTICA ==============
    extraerHepatico() {
        let resultados = [];

        // 1. BILIRRUBINA TOTAL/DIRECTA
        const biliT = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_total);
        const biliD = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.bilirrubina_directa);
        if (biliT || biliD) {
            let bt = biliT ? this.formatearNumeroConDecimales(biliT, 2, false) : '--';
            let bd = biliD ? this.formatearNumeroConDecimales(biliD, 2, false) : '--';
            
            resultados.push(this.formatearEtiquetaCompuesta('BiliT/D', bt, bd));
        }

        // 2. GOT/GPT (Transaminasas) 
        const got = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.got_asat);
        const gpt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.gpt_alt);

        if (got && gpt) {
            let gotFormateado = this.formatearNumeroConDecimales(got, 1, false, false, 'unidad_decimal'); 
            let gptFormateado = this.formatearNumeroConDecimales(gpt, 1, false, false, 'unidad_decimal'); 
            resultados.push(this.formatearEtiquetaCompuesta('GOT/GPT', gotFormateado, gptFormateado));
        } else if (got) {
            let gotFormateado = this.formatearNumeroConDecimales(got, 1, false, false, 'unidad_decimal'); 
            resultados.push(this.formatearEtiqueta('GOT', gotFormateado));
        } else if (gpt) {
            let gptFormateado = this.formatearNumeroConDecimales(gpt, 1, false, false, 'unidad_decimal'); 
            resultados.push(this.formatearEtiqueta('GPT', gptFormateado));
        }

        // 3. FOSFATASA ALCALINA 
        const fa = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.fosfatasa_alcalina);
        if (fa) {
            let faFormateada = this.formatearNumeroConDecimales(fa, 1, false, false, 'unidad_decimal'); 
            resultados.push(this.formatearEtiqueta('FA', faFormateada));
        }

        // 4. GGT 
        const ggt = extraerValor(this.texto, EXTRACTION_PATTERNS.hepatico.ggt);
        if (ggt) {
            let ggtFormateada = this.formatearNumeroConDecimales(ggt, 1, false, false, 'unidad_decimal'); 
            resultados.push(this.formatearEtiqueta('GGT', ggtFormateada));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE PCR Y MARCADORES INFLAMATORIOS ==============
    extraerPCR() {
        let resultados = [];

        // 1. PCR (Proteína C Reactiva) 
        const pcr = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.pcr);
        if (pcr) {
            let pcrFormateada = this.formatearNumeroConDecimales(pcr, 1, false);
            resultados.push(this.formatearEtiqueta('PCR', pcrFormateada));
        }

        // 2. PROCALCITONINA 
        const procalcitonina = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.procalcitonina);
        if (procalcitonina) {
            let procaFormateada = this.formatearNumeroConDecimales(procalcitonina, 2, false);
            resultados.push(this.formatearEtiqueta('Proca', procaFormateada));
        }

        // 3. VHS (Velocidad de Sedimentación) 
        const vhs = extraerValor(this.texto, EXTRACTION_PATTERNS.pcr.vhs);
        if (vhs) {
            let vhsFormateado = this.formatearNumeroConDecimales(vhs, 0, false);
            resultados.push(this.formatearEtiqueta('VHS', vhsFormateado));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE COAGULACIÓN ==============
    extraerCoagulacion() {
        let resultados = [];

        // 1. INR 
        const inr = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.inr);
        if (inr) {
            let inrFormateado = this.formatearNumeroConDecimales(inr, 2, false, false, 'inr'); 
            resultados.push(this.formatearEtiqueta('INR', inrFormateado));
        }

        // 2. TIEMPO DE PROTROMBINA + %TP 
        const pt = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.tiempo_protrombina);
        const ptPct = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.porcentaje_tp);
        if (pt) {
            let ptSeg = this.formatearNumeroConDecimales(pt, 1, false, false, 'unidad'); 
            
            let pctPart = '';
            if (ptPct) {
                let ptPctFormateado = this.formatearNumeroConDecimales(ptPct, 0, false, true); 
                pctPart = ` (${ptPctFormateado}%)`;
            }
            
            resultados.push(this.formatearEtiqueta('TP', `${ptSeg}s${pctPart}`));
        }

        // 3. TTPA 
        const ttpa = extraerValor(this.texto, EXTRACTION_PATTERNS.coagulacion.ttpa);
        if (ttpa) {
            let ttpaFormateado = this.formatearNumeroConDecimales(ttpa, 1, false, false, 'unidad'); 
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
            let proteinasFormateado = this.formatearNumeroConDecimales(proteinas, 1, false);
            resultados.push(this.formatearEtiqueta('Prot', proteinasFormateado));
        }

        // 2. ALBÚMINA 
        const albumina = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.albumina);
        if (albumina) {
            let albuminaFormateado = this.formatearNumeroConDecimales(albumina, 1, false);
            resultados.push(this.formatearEtiqueta('Alb', albuminaFormateado));
        }

        // 3. PREALBÚMINA 
        const prealbumin = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.prealbumin);
        if (prealbumin) {
            let prealbFormateado = this.formatearNumeroConDecimales(prealbumin, 2, false);
            resultados.push(this.formatearEtiqueta('PreAlb', prealbFormateado));
        }

        // 4. COLESTEROL TOTAL 
        const colT = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.colesterol_total);
        if (colT && (opcionesSeleccionadas.includes('ColT') || opcionesSeleccionadas.includes('Nutricional'))) {
            let colTFormateado = this.formatearNumeroConDecimales(colT, 0, false);
            resultados.push(this.formatearEtiqueta('ColT', colTFormateado));
        }

        // 5. LDL 
        const ldl = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.ldl);
        if (ldl && (opcionesSeleccionadas.includes('LDL') || opcionesSeleccionadas.includes('Nutricional'))) {
            let ldlFormateado = this.formatearNumeroConDecimales(ldl, 0, false);
            resultados.push(this.formatearEtiqueta('LDL', ldlFormateado));
        }

        // 6. HDL 
        const hdl = extraerValor(this.texto, EXTRACTION_PATTERNS.nutricional.hdl);
        if (hdl && (opcionesSeleccionadas.includes('HDL') || opcionesSeleccionadas.includes('Nutricional'))) {
            let hdlFormateado = this.formatearNumeroConDecimales(hdl, 0, false);
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
            let phFormateado = this.formatearNumeroConDecimales(ph, 2, false);
            resultados.push(this.formatearEtiqueta('pH', phFormateado));
        }

        // 2. PCO2 
        const pco2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.pco2);
        if (pco2) {
            let pco2Formateado = this.formatearNumeroConDecimales(pco2, 1, false);
            resultados.push(this.formatearEtiqueta('pCO2', pco2Formateado));
        }

        // 3. HCO3 
        const hco3 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.hco3);
        if (hco3) {
            let hco3Formateado = this.formatearNumeroConDecimales(hco3, 1, false);
            resultados.push(this.formatearEtiqueta('HCO3', hco3Formateado));
        }

        // 4. SATURACIÓN O2 
        const satO2 = extraerValor(this.texto, EXTRACTION_PATTERNS.gases.saturacion_o2);
        if (satO2) {
            let satO2Formateado = this.formatearNumeroConDecimales(satO2, 1, false);
            resultados.push(this.formatearEtiqueta('SatO2', satO2Formateado));
        }

        return this.limpiarAsteriscos(resultados.join(', '));
    }

    // ============== EXTRACTOR DE FECHA ==============
    extraerFecha() {
        for (let patron of EXTRACTION_PATTERNS.fechas.patrones) {
            let coincidencia = this.texto.match(patron);
            if (coincidencia) {
                let fechaCompleta = coincidencia[1];
                const fechaLimpia = fechaCompleta.replace(/-/g, '/');
                const partes = fechaLimpia.split('/');

                if (partes.length === 3) {
                    const dia = partes[0].padStart(2, '0');
                    const mes = partes[1].padStart(2, '0');
                    let anio = partes[2];

                    if (anio.length === 2) anio = '20' + anio;

                    const format = this.formatOptions.dateFormat || 'dd/mm/yyyy';
                    let fechaStr = '';

                    if (format === 'dd/mm') {
                        fechaStr = `${dia}/${mes}`;
                    } else if (format === 'dd/mm/yy') {
                        fechaStr = `${dia}/${mes}/${anio.substring(2)}`;
                    } else {
                        fechaStr = `${dia}/${mes}/${anio}`;
                    }

                    return `${fechaStr}:`;
                }

                return fechaCompleta.substring(0, 5) + ':';
            }
        }
        return '';
    }

    // ============== FUNCIÓN PRINCIPAL ==============
    procesar(texto, opcionesSeleccionadas) {
        this.texto = texto;
        let lineas = [];

        let fecha = '';
        if (opcionesSeleccionadas.includes('Fecha')) {
            fecha = this.extraerFecha();
        }

        let secciones = [];

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

        if (secciones.length === 0) {
            return fecha ? fecha : 'No se encontraron datos';
        }

        const resultado = this.formatearResultadoEstructurado(fecha, secciones);
        return resultado;
    }

    formatearResultadoEstructurado(fecha, secciones) {
        const SOFT_LINE_BREAK = '\u2028'; 

        const separadorLineas = this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ', ';

        let resultado = fecha ? fecha + (this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ' ') : '';

        const separador = this.formatOptions.usarSaltosLinea ? SOFT_LINE_BREAK : ', ';

        resultado += secciones.join(separador);

        return resultado;
    }
}

window.SimpleExtractor = SimpleExtractor;
