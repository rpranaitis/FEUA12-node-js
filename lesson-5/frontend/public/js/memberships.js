import { showSpinner, hideSpinner } from './script.js';

const bodyBlock = document.querySelector('.body-block');

renderMemberships();

function renderMemberships() {
  showSpinner();
  bodyBlock.innerHTML = '';

  fetch('http://localhost:3000/memberships')
    .then((response) => response.json())
    .then((data) => {
      data.forEach((membership) => {
        const divCard = document.createElement('div');
        bodyBlock.append(divCard);
        divCard.classList.add('card');

        const divTop = document.createElement('div');
        divCard.append(divTop);

        const h3 = document.createElement('h3');
        divTop.append(h3);
        h3.textContent = `$${membership.price.toFixed(2)} ${membership.name}`;

        const spanDescription = document.createElement('span');
        divTop.append(spanDescription);
        spanDescription.classList.add('description');
        spanDescription.textContent = membership.description;

        const divBottom = document.createElement('div');
        divCard.append(divBottom);

        const buttonDelete = document.createElement('button');
        divBottom.append(buttonDelete);
        buttonDelete.classList.add('btn-delete');
        buttonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        buttonDelete.addEventListener('click', () => {
          if (confirm(`Are you sure you want to delete „${membership.name}“ membership?`)) {
            deleteMembership(membership._id);
          }
        });
      });

      hideSpinner();
    });
}

function deleteMembership(id) {
  showSpinner();

  fetch('http://localhost:3000/memberships/' + id, {
    method: 'DELETE',
  })
    .then((response) => response.json())
    .then((data) => {
      hideSpinner();
      alert(data.message);
      renderMemberships();
    });
}
