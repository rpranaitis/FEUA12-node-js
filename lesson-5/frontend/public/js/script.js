const spinner = document.getElementById('spinner');

export function showSpinner() {
  spinner.classList.add('show');
}

export function hideSpinner() {
  spinner.classList.remove('show');
}
