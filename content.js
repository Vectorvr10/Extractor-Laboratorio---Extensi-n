// Content script simplificado
console.log('Extractor SSASUR cargado');

// Escuchar mensajes del background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'extractText') {
        // Extraer texto de la página actual
        const pageText = document.body.innerText;
        sendResponse({ text: pageText });
    }
    
    if (message.action === 'autoExtract') {
        // Notificar que se solicita auto-extracción
        chrome.runtime.sendMessage({ action: 'autoExtractRequested' });
    }
});
