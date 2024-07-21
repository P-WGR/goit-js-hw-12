import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.querySelector('.form').addEventListener('submit', event => {
  event.preventDefault();

  const delay = parseInt(event.target.delay.value, 10);
  const state = event.target.state.value;

  setTimeout(() => {
    if (state === 'fulfilled') {
      Promise.resolve(`✅ Fulfilled promise in ${delay}ms`).then(message =>
        iziToast.show({
          message: message,
          messageSize: '16px',
          backgroundColor: 'rgba(89, 161, 13, 1)',
          messageColor: 'white',
          iconColor: 'white',
          progressBarColor: 'rgba(50, 97, 1, 1)',
          close: false,
          position: 'topRight',
        })
      );
    } else {
      Promise.reject(`❌ Rejected promise in ${delay}ms`).catch(message =>
        iziToast.show({
          message: message,
          messageSize: '16px',
          backgroundColor: 'rgba(239, 64, 64, 1)',
          messageColor: 'white',
          iconColor: 'white',
          progressBarColor: 'rgba(181, 27, 27, 1)',
          close: false,
          position: 'topRight',
        })
      );
    }
  }, delay);
});
