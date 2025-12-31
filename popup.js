// popup.js - MODIFICADO CON LAS NUEVAS ESPECIFICACIONES
class SSASURExtractor {
    constructor() {
        this.extractor = new SimpleExtractor();
        this.currentText = '';
        this.results = '';
        this.autoMode = false; // AUTO MODE DESACTIVADO POR DEFECTO
        this.activeCategory = 'all'; // TODOS SELECCIONADOS POR DEFECTO
        this.allSelected = true; // TODOS LOS EXÁMENES SELECCIONADOS POR DEFECTO
        
        this.initializeElements();
        this.bindEvents();
        this.loadSavedSettings();
        this.setupDarkMode();
        this.updateTabIndicators();
        
        // Cargar "Todos los Exámenes" por defecto
        this.loadAllExams();
        
        // Seleccionar TODOS los checkboxes por defecto
        setTimeout(() => {
            this.selectAllExams();
            // Mostrar mensaje inicial
            this.showResultsPlaceholder('Haz clic en "Extraer Ahora" para procesar texto del portapapeles');
        }, 100);
    }

    initializeElements() {
        // Tabs de categorías
        this.categoryTabs = document.querySelectorAll('.category-tab');
        
        // Panel avanzado
        this.advancedPanel = document.getElementById('advancedOptionsPanel');
        this.advancedTitle = document.getElementById('advancedPanelTitle');
        this.advancedContainer = document.getElementById('advancedExamsContainer');
        this.closeAdvancedBtn = document.getElementById('closeAdvancedBtn');
        
        // Templates
        this.templates = {
            hemograma: document.getElementById('template-hemograma'),
            bioquimica: document.getElementById('template-bioquimica'),
            coagulacion: document.getElementById('template-coagulacion'),
            gases: document.getElementById('template-gases'),
            nutricional: document.getElementById('template-nutricional')
        };
        
        // Opciones de formato (AHORA INCLUYE FECHA)
        this.formatFecha = document.getElementById('formatFecha');
        this.formatHb = document.getElementById('formatHb');
        this.formatMayusculas = document.getElementById('formatMayusculas');
        this.formatDosPuntos = document.getElementById('formatDosPuntos');
        this.formatSaltos = document.getElementById('formatSaltos');
        
        // Checkboxes de exámenes (se inicializarán dinámicamente)
        this.examCheckboxes = [];
        
        // Botones
        this.extractBtn = document.getElementById('extractBtn');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.autoModeBtn = document.getElementById('autoModeBtn');
        this.settingsBtn = document.getElementById('settingsBtn'); // Botón para redireccionar
        
        // Elementos de resultados
        this.resultsContent = document.getElementById('resultsContent');
        this.resultsPlaceholder = document.getElementById('resultsPlaceholder');
        this.notification = document.getElementById('notification');
    }

    bindEvents() {
        // Tabs de categorías - MODIFICADO para mantener selecciones
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category, e.currentTarget);
            });
        });

        // Botón cerrar panel avanzado
        this.closeAdvancedBtn.addEventListener('click', () => {
            this.closeAdvancedPanel();
        });

        // Botones principales
        this.extractBtn.addEventListener('click', () => this.extractFromClipboard());
        this.copyAllBtn.addEventListener('click', () => this.copyResults());
        
        // Botón "Seleccionar Todo" - MODIFICADO para toggle
        this.selectAllBtn.addEventListener('click', () => {
            this.toggleAllExams();
        });
        
        this.clearAllBtn.addEventListener('click', () => this.clearAllExams());
        this.autoModeBtn.addEventListener('click', () => this.toggleAutoMode());
        
        // MODIFICADO: Cambiar la función del botón settings para redireccionar
        this.settingsBtn.addEventListener('click', () => {
            this.redirectToExtractorHIS();
        });

        // Listeners para opciones de formato (AHORA INCLUYE FECHA)
        [this.formatFecha, this.formatHb, this.formatMayusculas, this.formatDosPuntos, this.formatSaltos].forEach(option => {
            option.addEventListener('change', () => {
                this.saveSettings();
                if (this.currentText) {
                    this.processCurrentText();
                }
            });
        });

        // Clic fuera del panel avanzado para cerrar
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-tab') && 
                !e.target.closest('.advanced-options-panel') &&
                this.advancedPanel.classList.contains('show')) {
                this.closeAdvancedPanel();
            }
        });
    }

    // NUEVO MÉTODO: Redireccionar al enlace de ExtractorHIS
    redirectToExtractorHIS() {
        // Abrir el enlace en una nueva pestaña
        chrome.tabs.create({
            url: 'https://notionmedufro.github.io/ExtractorHIS/',
            active: true
        });
        
        // Mostrar notificación
        this.showNotification('Redirigiendo a ExtractorHIS', 'info');
    }

    // Resto del código permanece igual...
    switchCategory(category, tabElement) {
        // Actualizar categoría activa
        this.activeCategory = category;
        
        // Actualizar tabs activos
        this.categoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        // Mostrar/ocultar panel avanzado según la categoría
        if (category === 'all') {
            this.closeAdvancedPanel();
            // Para "Todos", mantener todos los checkboxes visibles
            this.loadAllExams();
        } else {
            this.openAdvancedPanel(category);
        }
        
        // Actualizar indicadores
        this.updateTabIndicators();
        
        // Notificar cambio
        const categoryNames = {
            'all': 'Todos los exámenes',
            'hemograma': 'Hemograma',
            'bioquimica': 'Bioquímica',
            'coagulacion': 'Coagulación',
            'gases': 'Gases en Sangre',
            'nutricional': 'Nutricional'
        };
        
        this.showNotification(`Mostrando ${categoryNames[category]}`, 'info');
    }

    openAdvancedPanel(category) {
        // Cargar contenido específico según categoría
        this.loadCategoryContent(category);
        
        // Mostrar panel con animación
        this.advancedPanel.classList.add('show');
        
        // Actualizar título
        const titles = {
            'hemograma': 'Opciones Avanzadas - Hemograma',
            'bioquimica': 'Opciones Avanzadas - Bioquímica',
            'coagulacion': 'Opciones Avanzadas - Coagulación',
            'gases': 'Opciones Avanzadas - Gases en Sangre',
            'nutricional': 'Opciones Avanzadas - Nutricional'
        };
        
        this.advancedTitle.textContent = titles[category] || 'Opciones Avanzadas';
    }

    closeAdvancedPanel() {
        this.advancedPanel.classList.remove('show');
        // Mantener la categoría activa visualmente
        this.categoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === this.activeCategory);
        });
    }

    loadCategoryContent(category) {
        // Limpiar contenedor
        this.advancedContainer.innerHTML = '';
        
        // Clonar template correspondiente
        if (this.templates[category]) {
            const templateContent = this.templates[category].content.cloneNode(true);
            this.advancedContainer.appendChild(templateContent);
        }
        
        // Recolectar checkboxes
        this.collectCheckboxes();
        
        // Vincular eventos a los nuevos checkboxes
        this.bindCheckboxEvents();
        
        // Cargar estados guardados (sin modificar selecciones actuales)
        this.loadCheckboxStates();
        
        // Actualizar indicadores
        this.updateTabIndicators();
    }

    loadAllExams() {
        // Para "Todos", cargar todos los templates
        this.advancedContainer.innerHTML = '';
        
        // Cargar todos los templates
        const categories = ['hemograma', 'bioquimica', 'coagulacion', 'gases', 'nutricional'];
        categories.forEach(cat => {
            if (this.templates[cat]) {
                const templateContent = this.templates[cat].content.cloneNode(true);
                this.advancedContainer.appendChild(templateContent);
            }
        });
        
        // Recolectar y vincular checkboxes
        this.collectCheckboxes();
        this.bindCheckboxEvents();
        
        // Asegurar que todos estén seleccionados por defecto
        if (this.allSelected) {
            this.selectAllExams();
        } else {
            this.loadCheckboxStates();
        }
        
        this.updateTabIndicators();
        this.updateSelectAllButton();
    }

    selectAllExams() {
        // Seleccionar TODOS los checkboxes
        this.examCheckboxes.forEach(cb => {
            cb.checked = true;
        });
        this.allSelected = true;
        this.saveSettings();
        this.updateSelectAllButton();
    }

    collectCheckboxes() {
        this.examCheckboxes = Array.from(document.querySelectorAll('.exam-checkbox'));
    }

    bindCheckboxEvents() {
        this.examCheckboxes.forEach(cb => {
            // Remover listeners anteriores si existen
            const newCb = cb.cloneNode(true);
            cb.parentNode.replaceChild(newCb, cb);
            
            // Añadir nuevo listener
            newCb.addEventListener('change', () => {
                this.handleCheckboxChange();
            });
        });
        
        // Recolectar checkboxes actualizados
        this.collectCheckboxes();
    }

    handleCheckboxChange() {
        this.saveSettings();
        this.updateTabIndicators();
        this.updateSelectAllButton();
        
        if (this.autoMode && this.currentText) {
            this.processCurrentText();
        }
    }

    updateTabIndicators() {
        // Recolectar checkboxes actuales
        this.collectCheckboxes();
        
        // Contar selecciones por categoría
        const categorySelections = {
            'hemograma': ['hemograma', 'hcto', 'vcm', 'chcm', 'rdw', 'reticulocitos', 'linfocitos', 'ran', 'ral'],
            'bioquimica': ['pcr', 'renal', 'hepatico', 'vfg', 'urea', 'electrolitos', 'magnesio', 'acidoUrico'],
            'coagulacion': ['coagulacion', 'inr', 'tp'],
            'gases': ['gases'],
            'nutricional': ['nutricional', 'proteinas', 'lipidos']
        };
        
        // Actualizar cada tab
        this.categoryTabs.forEach(tab => {
            const category = tab.dataset.category;
            
            if (category === 'all') {
                // Para "Todos", verificar si hay al menos un checkbox marcado
                const hasAnyChecked = this.examCheckboxes.some(cb => cb.checked);
                const allChecked = this.examCheckboxes.length > 0 && 
                                  this.examCheckboxes.every(cb => cb.checked);
                
                tab.classList.toggle('has-selected', hasAnyChecked);
                
                // Actualizar estado de "todos seleccionados"
                this.allSelected = allChecked;
                
            } else {
                // Para categorías específicas, verificar checkboxes correspondientes
                const categoryChecks = categorySelections[category] || [];
                const hasCategoryChecked = this.examCheckboxes.some(cb => 
                    cb.checked && categoryChecks.includes(cb.dataset.exam)
                );
                
                tab.classList.toggle('has-selected', hasCategoryChecked);
            }
        });
    }

    updateSelectAllButton() {
        // Verificar si todos están seleccionados
        const allChecked = this.examCheckboxes.length > 0 && 
                          this.examCheckboxes.every(cb => cb.checked);
        
        // Actualizar texto del botón
        if (allChecked) {
            this.selectAllBtn.innerHTML = '<span>✗</span> Deseleccionar Todo';
            this.allSelected = true;
        } else {
            this.selectAllBtn.innerHTML = '<span>✓</span> Seleccionar Todo';
            this.allSelected = false;
        }
    }

    toggleAllExams() {
        // Alternar entre seleccionar todos y deseleccionar todos
        const shouldSelect = !this.allSelected;
        
        this.examCheckboxes.forEach(cb => {
            cb.checked = shouldSelect;
        });
        
        this.allSelected = shouldSelect;
        
        // Actualizar interfaz
        this.saveSettings();
        this.updateTabIndicators();
        this.updateSelectAllButton();
        
        if (this.currentText) {
            this.processCurrentText();
        }
        
        const action = shouldSelect ? 'seleccionados' : 'deseleccionados';
        this.showNotification(`Todos los exámenes ${action}`, 'success');
    }

    clearAllExams() {
        this.examCheckboxes.forEach(cb => cb.checked = false);
        this.allSelected = false;
        this.saveSettings();
        this.updateTabIndicators();
        this.updateSelectAllButton();
        this.showResultsPlaceholder('Selecciona los exámenes que deseas extraer');
        this.showNotification('Selección limpiada', 'info');
    }

    setupDarkMode() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.applyDarkMode(darkModeMediaQuery.matches);
        
        darkModeMediaQuery.addEventListener('change', (e) => {
            this.applyDarkMode(e.matches);
        });
    }

    applyDarkMode(isDark) {
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    }

    async extractFromClipboard() {
        try {
            const text = await navigator.clipboard.readText();
            if (text.trim()) {
                this.currentText = text;
                this.processCurrentText();
                this.showNotification('Texto extraído del portapapeles', 'success');
            } else {
                this.showNotification('El portapapeles está vacío', 'error');
            }
        } catch (error) {
            console.error('Error al leer portapapeles:', error);
            this.showNotification('No se pudo acceder al portapapeles', 'error');
        }
    }

    getSelectedExams() {
        this.collectCheckboxes(); // Asegurarse de tener checkboxes actualizados
        
        // Solo incluir exámenes si están seleccionados Y la opción de fecha está activa
        const exams = this.examCheckboxes
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.exam);
            
        // Añadir fecha si está seleccionada en formato
        if (this.formatFecha.checked) {
            exams.unshift('fecha');
        }
        
        return exams;
    }

    getFormatOptions() {
        return {
            usarDosPuntos: this.formatDosPuntos.checked,
            usarMayusculas: this.formatMayusculas.checked,
            usarSaltosLinea: this.formatSaltos.checked,
            usarHb: this.formatHb.checked,
            dateFormat: 'dd/mm/yyyy'
        };
    }

    mapExamToExtractor(exam) {
        const mapping = {
            'fecha': 'Fecha',
            'hemograma': 'Hemograma',
            'hcto': 'Hcto',
            'vcm': 'VCM',
            'chcm': 'CHCM',
            'rdw': 'RDW',
            'reticulocitos': 'Reticulocitos',
            'linfocitos': 'Linfocitos',
            'ran': 'RAN',
            'ral': 'RAL',
            'pcr': 'PCR',
            'renal': 'Renal',
            'vfg': 'VFG',
            'urea': 'Urea',
            'electrolitos': 'Electrolitos',
            'magnesio': 'Magnesio',
            'acidoUrico': 'AcidoUrico',
            'hepatico': 'Hepático',
            'coagulacion': 'Coagulación',
            'inr': 'INR',
            'tp': 'TP',
            'gases': 'Gases',
            'nutricional': 'Nutricional',
            'proteinas': 'Proteínas',
            'lipidos': 'Lípidos'
        };
        
        return mapping[exam] || exam;
    }

    processCurrentText() {
        const exams = this.getSelectedExams();
        const formatOptions = this.getFormatOptions();
        
        if (exams.length === 0 || (exams.length === 1 && exams[0] === 'fecha')) {
            this.showResultsPlaceholder('Selecciona al menos un examen');
            return;
        }

        try {
            this.extractor.setFormatOptions(formatOptions);
            const extractorParams = exams.map(exam => this.mapExamToExtractor(exam));
            const result = this.extractor.procesar(this.currentText, extractorParams);
            
            if (result && result.trim()) {
                this.showResults(result);
            } else {
                this.showResultsPlaceholder('No se encontraron datos con los exámenes seleccionados');
            }
        } catch (error) {
            console.error('Error procesando texto:', error);
            this.showResultsPlaceholder('Error al procesar el texto');
        }
    }

    showResults(result) {
        this.results = result;
        this.resultsPlaceholder.style.display = 'none';
        this.resultsContent.style.display = 'block';
        this.resultsContent.textContent = result;
    }

    showResultsPlaceholder(message) {
        this.resultsPlaceholder.innerHTML = `
            <div class="icon">📄</div>
            <p>${message}</p>
        `;
        this.resultsPlaceholder.style.display = 'block';
        this.resultsContent.style.display = 'none';
        this.results = '';
    }

    async copyResults() {
        if (!this.results) {
            this.showNotification('No hay resultados para copiar', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(this.results);
            this.showNotification('Resultados copiados al portapapeles', 'success');
        } catch (error) {
            console.error('Error copiando resultados:', error);
            this.showNotification('Error al copiar resultados', 'error');
        }
    }

    toggleAutoMode() {
        this.autoMode = !this.autoMode;
        const modeText = this.autoMode ? 'ON' : 'OFF';
        const modeClass = this.autoMode ? 'success' : '';
        
        this.autoModeBtn.innerHTML = `<span>🤖</span> Modo Auto: ${modeText}`;
        this.autoModeBtn.className = `action-btn ${modeClass}`;
        
        this.showNotification(`Modo automático ${modeText}`, 'info');
        this.saveSettings();
    }

    // MODIFICADO: Eliminar showSettings y reemplazar por redirectToExtractorHIS

    showNotification(message, type = 'info') {
        this.notification.textContent = message;
        this.notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    saveSettings() {
        const settings = {
            formatFecha: this.formatFecha.checked,
            formatHb: this.formatHb.checked,
            formatMayusculas: this.formatMayusculas.checked,
            formatDosPuntos: this.formatDosPuntos.checked,
            formatSaltos: this.formatSaltos.checked,
            autoMode: this.autoMode,
            activeCategory: this.activeCategory,
            allSelected: this.allSelected
        };

        const examStates = {};
        this.examCheckboxes.forEach(cb => {
            examStates[cb.dataset.exam] = cb.checked;
        });

        chrome.storage.local.set({
            settings: settings,
            examStates: examStates
        });
    }

    loadSavedSettings() {
        chrome.storage.local.get(['settings', 'examStates'], (data) => {
            if (data.settings) {
                // Cargar opciones de formato
                this.formatFecha.checked = data.settings.formatFecha !== false;
                this.formatHb.checked = data.settings.formatHb !== false;
                this.formatMayusculas.checked = data.settings.formatMayusculas || false;
                this.formatDosPuntos.checked = data.settings.formatDosPuntos !== false;
                this.formatSaltos.checked = data.settings.formatSaltos !== false;
                
                this.autoMode = data.settings.autoMode || false;
                this.activeCategory = data.settings.activeCategory || 'all';
                this.allSelected = data.settings.allSelected !== false;
                
                // Actualizar botón de modo automático
                const modeText = this.autoMode ? 'ON' : 'OFF';
                const modeClass = this.autoMode ? 'success' : '';
                this.autoModeBtn.innerHTML = `<span>🤖</span> Modo Auto: ${modeText}`;
                this.autoModeBtn.className = `action-btn ${modeClass}`;
                
                // Restaurar categoría activa - "Todos los Exámenes"
                const allTab = document.querySelector('.category-tab[data-category="all"]');
                if (allTab) {
                    this.switchCategory('all');
                }
            }

            // Cargar estados de checkboxes
            setTimeout(() => {
                if (data.examStates && !this.allSelected) {
                    this.loadCheckboxStates();
                } else {
                    // Seleccionar todos por defecto
                    this.selectAllExams();
                }
                this.updateTabIndicators();
                this.updateSelectAllButton();
            }, 100);
        });
    }

    loadCheckboxStates() {
        chrome.storage.local.get(['examStates'], (data) => {
            if (data.examStates) {
                this.examCheckboxes.forEach(cb => {
                    const exam = cb.dataset.exam;
                    if (data.examStates[exam] !== undefined) {
                        cb.checked = data.examStates[exam];
                    }
                });
                this.updateSelectAllButton();
            }
        });
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    new SSASURExtractor();
});
