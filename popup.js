class ExtractorLab {
    constructor() {
        this.extractor = new SimpleExtractor();
        this.currentText = '';
        this.results = '';
        this.autoMode = false;
        this.activeCategory = 'all';
        this.allSelected = true;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSavedSettings();
        this.setupDarkMode();
        this.updateTabIndicators();
        
        this.loadAllExams();
        
        setTimeout(() => {
            this.selectAllExams();
            this.showResultsPlaceholder('Haz clic en "Extraer Ahora" para procesar texto del portapapeles');
        }, 100);
    }

    initializeElements() {
        this.categoryTabs = document.querySelectorAll('.category-tab');
        
        this.advancedPanel = document.getElementById('advancedOptionsPanel');
        this.advancedTitle = document.getElementById('advancedPanelTitle');
        this.advancedContainer = document.getElementById('advancedExamsContainer');
        this.closeAdvancedBtn = document.getElementById('closeAdvancedBtn');
        
        this.templates = {
            hemograma: document.getElementById('template-hemograma'),
            bioquimica: document.getElementById('template-bioquimica'),
            coagulacion: document.getElementById('template-coagulacion'),
            gases: document.getElementById('template-gases'),
            nutricional: document.getElementById('template-nutricional')
        };
        
        this.formatFecha = document.getElementById('formatFecha');
        this.formatHb = document.getElementById('formatHb');
        this.formatMayusculas = document.getElementById('formatMayusculas');
        this.formatDosPuntos = document.getElementById('formatDosPuntos');
        this.formatSaltos = document.getElementById('formatSaltos');
        
        this.examCheckboxes = [];
        
        this.extractBtn = document.getElementById('extractBtn');
        this.copyAllBtn = document.getElementById('copyAllBtn');
        this.selectAllBtn = document.getElementById('selectAllBtn');
        this.clearAllBtn = document.getElementById('clearAllBtn');
        this.autoModeBtn = document.getElementById('autoModeBtn');
        this.settingsBtn = document.getElementById('settingsBtn');
        
        this.resultsContent = document.getElementById('resultsContent');
        this.resultsPlaceholder = document.getElementById('resultsPlaceholder');
        this.notification = document.getElementById('notification');
    }

    bindEvents() {
        this.categoryTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.switchCategory(category, e.currentTarget);
            });
        });

        this.closeAdvancedBtn.addEventListener('click', () => {
            this.closeAdvancedPanel();
        });

        this.extractBtn.addEventListener('click', () => this.extractFromClipboard());
        this.copyAllBtn.addEventListener('click', () => this.copyResults());
        this.selectAllBtn.addEventListener('click', () => this.toggleAllExams());
        this.clearAllBtn.addEventListener('click', () => this.clearAllExams());
        this.autoModeBtn.addEventListener('click', () => this.toggleAutoMode());
        
        this.settingsBtn.addEventListener('click', () => {
            this.redirectToExtractorHIS();
        });

        [this.formatFecha, this.formatHb, this.formatMayusculas, 
         this.formatDosPuntos, this.formatSaltos].forEach(option => {
            option.addEventListener('change', () => {
                this.saveSettings();
                if (this.currentText) {
                    this.processCurrentText();
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-tab') && 
                !e.target.closest('.advanced-options-panel') &&
                this.advancedPanel.classList.contains('show')) {
                this.closeAdvancedPanel();
            }
        });
    }

    redirectToExtractorHIS() {
        chrome.tabs.create({
            url: 'https://notionmedufro.github.io/ExtractorHIS/',
            active: true
        });
        this.showNotification('Redirigiendo a ExtractorHIS', 'info');
    }

    switchCategory(category, tabElement) {
        this.activeCategory = category;
        
        this.categoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === category);
        });
        
        if (category === 'all') {
            this.closeAdvancedPanel();
            this.loadAllExams();
        } else {
            this.openAdvancedPanel(category);
        }
        
        this.updateTabIndicators();
    }

    openAdvancedPanel(category) {
        this.loadCategoryContent(category);
        this.advancedPanel.classList.add('show');
        
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
        this.categoryTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.category === this.activeCategory);
        });
    }

    loadCategoryContent(category) {
        this.advancedContainer.innerHTML = '';
        
        if (this.templates[category]) {
            const templateContent = this.templates[category].content.cloneNode(true);
            this.advancedContainer.appendChild(templateContent);
        }
        
        this.collectCheckboxes();
        this.bindCheckboxEvents();
        this.loadCheckboxStates();
        this.updateTabIndicators();
    }

    loadAllExams() {
        this.advancedContainer.innerHTML = '';
        
        const categories = ['hemograma', 'bioquimica', 'coagulacion', 'gases', 'nutricional'];
        categories.forEach(cat => {
            if (this.templates[cat]) {
                const templateContent = this.templates[cat].content.cloneNode(true);
                this.advancedContainer.appendChild(templateContent);
            }
        });
        
        this.collectCheckboxes();
        this.bindCheckboxEvents();
        
        if (this.allSelected) {
            this.selectAllExams();
        } else {
            this.loadCheckboxStates();
        }
        
        this.updateTabIndicators();
        this.updateSelectAllButton();
    }

    selectAllExams() {
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
            const newCb = cb.cloneNode(true);
            cb.parentNode.replaceChild(newCb, cb);
            
            newCb.addEventListener('change', () => {
                this.handleCheckboxChange();
            });
        });
        
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
        this.collectCheckboxes();
        
        const categorySelections = {
            'hemograma': ['hemograma', 'hcto', 'vcm', 'chcm', 'rdw', 'reticulocitos', 'linfocitos', 'ran', 'ral'],
            'bioquimica': ['pcr', 'renal', 'hepatico', 'vfg', 'urea', 'electrolitos', 'magnesio', 'acidoUrico'],
            'coagulacion': ['coagulacion', 'inr', 'tp'],
            'gases': ['gases'],
            'nutricional': ['nutricional', 'proteinas', 'lipidos']
        };
        
        this.categoryTabs.forEach(tab => {
            const category = tab.dataset.category;
            
            if (category === 'all') {
                const hasAnyChecked = this.examCheckboxes.some(cb => cb.checked);
                const allChecked = this.examCheckboxes.length > 0 && 
                                  this.examCheckboxes.every(cb => cb.checked);
                
                tab.classList.toggle('has-selected', hasAnyChecked);
                this.allSelected = allChecked;
                
            } else {
                const categoryChecks = categorySelections[category] || [];
                const hasCategoryChecked = this.examCheckboxes.some(cb => 
                    cb.checked && categoryChecks.includes(cb.dataset.exam)
                );
                
                tab.classList.toggle('has-selected', hasCategoryChecked);
            }
        });
    }

    updateSelectAllButton() {
        const allChecked = this.examCheckboxes.length > 0 && 
                          this.examCheckboxes.every(cb => cb.checked);
        
        if (allChecked) {
            this.selectAllBtn.innerHTML = '<span>✗</span> Deseleccionar Todo';
            this.allSelected = true;
        } else {
            this.selectAllBtn.innerHTML = '<span>✓</span> Seleccionar Todo';
            this.allSelected = false;
        }
    }

    toggleAllExams() {
        const shouldSelect = !this.allSelected;
        
        this.examCheckboxes.forEach(cb => {
            cb.checked = shouldSelect;
        });
        
        this.allSelected = shouldSelect;
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
        this.collectCheckboxes();
        
        const exams = this.examCheckboxes
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.exam);
            
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
                this.formatFecha.checked = data.settings.formatFecha !== false;
                this.formatHb.checked = data.settings.formatHb !== false;
                this.formatMayusculas.checked = data.settings.formatMayusculas || false;
                this.formatDosPuntos.checked = data.settings.formatDosPuntos !== false;
                this.formatSaltos.checked = data.settings.formatSaltos !== false;
                
                this.autoMode = data.settings.autoMode || false;
                this.activeCategory = data.settings.activeCategory || 'all';
                this.allSelected = data.settings.allSelected !== false;
                
                const modeText = this.autoMode ? 'ON' : 'OFF';
                const modeClass = this.autoMode ? 'success' : '';
                this.autoModeBtn.innerHTML = `<span>🤖</span> Modo Auto: ${modeText}`;
                this.autoModeBtn.className = `action-btn ${modeClass}`;
                
                const allTab = document.querySelector('.category-tab[data-category="all"]');
                if (allTab) {
                    this.switchCategory('all');
                }
            }

            setTimeout(() => {
                if (data.examStates && !this.allSelected) {
                    this.loadCheckboxStates();
                } else {
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

document.addEventListener('DOMContentLoaded', () => {
    new ExtractorLab();
});
