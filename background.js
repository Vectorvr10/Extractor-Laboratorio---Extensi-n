chrome.runtime.onInstalled.addListener(() => {
  console.log('Extractor de Laboratorio instalado');
  chrome.storage.local.set({
    settings: {
      formatHb: true,
      formatGB: true,
      formatELP: true,
      formatMayusculas: false,
      formatRedondear: false,
      formatDosPuntos: true,
      formatSaltos: true,
      formatFecha: true,
      autoMode: false
    }
  });
});
