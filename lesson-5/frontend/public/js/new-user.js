import { showSpinner, hideSpinner } from './script.js';

const form = document.querySelector('form');

(function renderMembershipsInSelect() {
  showSpinner();

  fetch('http://localhost:3000/memberships')
    .then((response) => response.json())
    .then((data) => {
      const select = document.getElementById('memberships');

      data.forEach((membership) => {
        const option = document.createElement('option');
        select.append(option);
        option.value = membership._id;
        option.textContent = membership.name;
      });

      hideSpinner();
    });
})();

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name');
  const surname = document.getElementById('surname');
  const email = document.getElementById('email');
  const membership = document.getElementById('memberships');

  const data = {
    name: name.value,
    surname: surname.value,
    email: email.value,
    service_id: membership.value,
  };

  showSpinner();

  fetch('http://localhost:3000/users', {
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

      if (data.status === 200) {
        window.location.href = '/users';
      }
    });
});
