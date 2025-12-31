// Service Worker de la extensión
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extractor SSASUR instalado');
    
    // Configuración por defecto
    chrome.storage.local.set({
        settings: {
            formatHb: true,
            formatMayusculas: false,
            formatDosPuntos: true,
            formatSaltos: true,
            autoMode: false,
            formatFecha: true
        }
    });
});

// Cuando se hace clic en el icono de la extensión
chrome.action.onClicked.addListener((tab) => {
    // Abrir el popup (se manejará la auto-extracción desde allí)
    chrome.action.openPopup();
});

// Escuchar mensajes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'autoExtractRequested') {
        console.log('Auto-extracción solicitada');
        // Podrías implementar lógica adicional aquí si es necesario
    }
});
