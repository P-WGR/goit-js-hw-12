import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
let userSelectedDate;
const startButton = document.querySelector('button[data-start]');
const datePickerInput = document.querySelector('#datetime-picker');
startButton.disabled = true;
const validateDate = selectedDate => {
  const now = Date.now();
  if (selectedDate <= now) {
    return Promise.reject('Please choose a date in the future');
  }
  return Promise.resolve(selectedDate);
};
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: Date.now(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    console.log(selectedDate);
    validateDate(selectedDate)
      .then(validDate => {
        userSelectedDate = validDate;
        startButton.disabled = false;
      })
      .catch(errorMessage => {
        iziToast.show({
          message: errorMessage,
          messageSize: '16px',
          backgroundColor: 'rgba(239, 64, 64, 1)',
          messageColor: 'white',
          iconColor: 'white',
          progressBarColor: 'rgba(181, 27, 27, 1)',
          close: false,
          position: 'topRight',
        });
        // window.alert(errorMessage);
        startButton.disabled = true;
      });
  },
};
flatpickr('#datetime-picker', options);
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);
  return { days, hours, minutes, seconds };
}
let countdown;
function disableDatePicker() {
  datePickerInput.disabled = true;
}
function updateTimerInterface({ days, hours, minutes, seconds }) {
  document.querySelector('span[data-days]').textContent = addLeadingZero(days);
  document.querySelector('span[data-hours]').textContent =
    addLeadingZero(hours);
  document.querySelector('span[data-minutes]').textContent =
    addLeadingZero(minutes);
  document.querySelector('span[data-seconds]').textContent =
    addLeadingZero(seconds);
}
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
function startTimer() {
  startButton.disabled = true;
  disableDatePicker();
  const updateTimer = () => {
    const now = Date.now();
    const timeDifference = userSelectedDate - now;
    if (timeDifference <= 0) {
      clearInterval(countdown);
      updateTimerInterface(convertMs(0));
      return;
    }
    const timeLeft = convertMs(timeDifference);
    updateTimerInterface(timeLeft);
  };
  updateTimer();
  countdown = setInterval(updateTimer, 1000);
}
startButton.addEventListener('click', startTimer);
