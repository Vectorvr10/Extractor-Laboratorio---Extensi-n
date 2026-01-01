console.log('Extractor de Laboratorio cargado');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getPageText') {
    sendResponse({ text: document.body.innerText });
  }
  return true;
});
