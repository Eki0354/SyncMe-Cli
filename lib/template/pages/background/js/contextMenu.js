'standard';

chrome.contextMenus.create({
  title: 'Click me!',
  contexts: ['page'],
  documentUrlPatterns: ['*://*.eki.space/*'],
  onclick: () => console.log('Sync me in contextmenu!')
});
