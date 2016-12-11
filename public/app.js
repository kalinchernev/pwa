'use strict';

/* global navigator */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('sw.js')
    .then(() => listenForInstallation());
}
else {
  console.log('Service workers are not available.')
}

function listenForInstallation() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.userChoice.then((choiceResult) => {
      if (choiceResult.outcome == 'dismissed') {
        console.log('You cancelled app installation.');
      }
      else {
        console.log('App added to home screen.');
      }
    });
  });  
}
