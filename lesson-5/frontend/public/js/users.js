import { showSpinner, hideSpinner } from './script.js';

const sort = document.getElementById('sort');
const sortWrapper = document.querySelector('.sort-wrapper');
const bodyBlock = document.querySelector('.body-block');

sort.addEventListener('change', (e) => {
  renderUsers(e.target.value);
});

renderUsers();

function renderUsers(order = 'asc') {
  showSpinner();
  bodyBlock.innerHTML = '';

  fetch('http://localhost:3000/users/' + order)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((user) => {
        const divCard = document.createElement('div');
        bodyBlock.append(divCard);
        divCard.classList.add('card');

        const spanCredentials = document.createElement('span');
        divCard.append(spanCredentials);
        spanCredentials.classList.add('credentials');
        spanCredentials.textContent = `${user.name} ${user.surname}`;

        const divDetails = document.createElement('div');
        divCard.append(divDetails);
        divDetails.classList.add('details');

        const spanEmail = document.createElement('span');
        divDetails.append(spanEmail);
        spanEmail.textContent = 'Email Address: ';

        const spanEmailValue = document.createElement('span');
        spanEmail.append(spanEmailValue);
        spanEmailValue.classList.add('text-primary');
        spanEmailValue.textContent = user.email;

        const spanMembership = document.createElement('span');
        divDetails.append(spanMembership);
        spanMembership.textContent = 'Membership: ';

        const spanMembershipValue = document.createElement('span');
        spanMembership.append(spanMembershipValue);
        spanMembershipValue.classList.add('text-primary');
        spanMembershipValue.textContent = user.service.name;

        const spanIp = document.createElement('span');
        divDetails.append(spanIp);
        spanIp.textContent = `IP: ${user.ip}`;
      });

      if (data.length) {
        sortWrapper.classList.add('show-flex');
      }

      hideSpinner();
    });
}
