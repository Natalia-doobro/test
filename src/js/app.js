import mainTemplate from '../templates/main.hbs';
import modalTemplate from '../templates/information.hbs';

const containerContact = document.querySelector('.contacts');
const users = document.querySelector('.users');
const favouriteUsers = document.querySelector('.favourite_users');
const modal = document.querySelector('.modal');
const gallery = document.querySelector('.text_gallery');
const modalButton = document.querySelector('.modal_button');
const contactButton = document.querySelector('.avatar_button');

let contactUser = [];
let user = '';

function usersContact(evt) {
  evt.preventDefault();
  containerContact.innerHTML = '';

  fetch('https://api.github.com/users')
    .then(response => {
      return response.json();
    })
    .then(data => {
      const markup = data.map(mainTemplate).join('');
      containerContact.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => {
      console.log(error);
    });

  containerContact.removeEventListener('click', informationUserFavourite);  
    containerContact.addEventListener('click', informationUser);
}

function informationUser(evt) {
  evt.preventDefault();

  if (evt.target.nodeName !== 'P') {
    return;
    }
  
  const nameUser = evt.target.textContent;
  user = nameUser;
    
  fetch(`https://api.github.com/users/${nameUser}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const markup = modalTemplate(data); 
      gallery.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => {
      console.log(error);
    });

    contactButton.classList.add('add');  
    contactButton.classList.remove('remove'); 
    contactButton.textContent = "Add to favorites";
    modal.classList.add('is_open');

    
    contactButton.addEventListener('click', addFavorites);
    contactButton.addEventListener('click', closeModal);
    modalButton.addEventListener('click', closeModal);
}

function closeModal(evt) {
  gallery.innerHTML = '';
    modal.classList.remove('is_open');
    
   
    contactButton.removeEventListener('click', addFavorites);
    contactButton.removeEventListener('click', removeFavorites);
    contactButton.removeEventListener('click', closeModal);
    modalButton.removeEventListener('click', closeModal);
}

function addFavorites(evt) {
   fetch(`https://api.github.com/users/${user}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
        contactUser.push(data);
    })
    .catch(error => {
      console.log(error);
    });
}

function usersContactFavourite(evt) {
    evt.preventDefault();
    containerContact.innerHTML = '';

    if (contactUser.length === 0) {
        return containerContact.insertAdjacentHTML('beforeend', 'no contacts');
    }
    containerContact.insertAdjacentHTML('beforeend', contactUser.map(mainTemplate).join(''));


    containerContact.removeEventListener('click', informationUser);
    containerContact.addEventListener('click', informationUserFavourite);
}

function informationUserFavourite(evt) {
  evt.preventDefault();

  if (evt.target.nodeName !== 'P') {
    return;
    }
    
  const nameUser = evt.target.textContent;
  user = nameUser;
    
  fetch(`https://api.github.com/users/${nameUser}`)
    .then(response => {
      return response.json();
    })
    .then(data => {
      const markup = modalTemplate(data); 
      gallery.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => {
      console.log(error);
    });

    contactButton.classList.add('remove');  
    contactButton.classList.remove('add'); 
    contactButton.textContent = "Remove contact";
    modal.classList.add('is_open');


    contactButton.addEventListener('click', removeFavorites);
    contactButton.addEventListener('click', closeModal);
    modalButton.addEventListener('click', closeModal);
}

function removeFavorites(e) {
    let userOb = contactUser.find(us => us.login === user)
    const userId = contactUser.indexOf(userOb)
  
    contactUser.splice(userId, 1);
    
    containerContact.innerHTML = '';
    containerContact.insertAdjacentHTML('beforeend', contactUser.map(mainTemplate).join(''));
}

users.addEventListener('click', usersContact);
favouriteUsers.addEventListener('click', usersContactFavourite);
