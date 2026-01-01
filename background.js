chrome.runtime.onInstalled.addListener(() => {
  console.log('Extractor de Laboratorio instalado');
  chrome.storage.local.set({
    settings: {
      formatHb: true,
      formatMayusculas: false,
      formatDosPuntos: true,
      formatSaltos: true,
      formatFecha: true,
      autoMode: false
    }
  });
});
