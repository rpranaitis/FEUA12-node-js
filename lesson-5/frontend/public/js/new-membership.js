import { showSpinner, hideSpinner } from './script.js';

const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('membershipName');
  const price = document.getElementById('membershipPrice');
  const description = document.getElementById('membershipDescription');

  const data = {
    name: name.value,
    price: price.value,
    description: description.value,
  };

  showSpinner();

  fetch('http://localhost:3000/memberships', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      hideSpinner();
      alert(data.message);
      window.location.href = '/memberships';
    });
});
