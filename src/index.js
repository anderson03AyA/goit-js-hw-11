import './css/styles.css';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputText = document.getElementById('search-box');
const ul = document.querySelector('.country-list');
const div = document.querySelector('.country-info');

const API_URL = `https://restcountries.com/v3.1/name/`;

const debounce = (callback, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

const handleInput = event => {
  if (inputText.value === '') {
    ul.style.display = 'none';
    div.style.display = 'none';
  } else {
    fetch(`${API_URL}${inputText.value.trim()}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Oops, there is no country with that name');
        }
        return response.json();
      })
      .then(users => {
        if (users.length >= 2 && users.length <= 10) {
          const tpl = users.map(
            user =>
              `<li><img src="${user.flags.svg}" alt="Flag of ${user.name.common}" width="50" height="30">${user.name.common}</li>`
          );
          ul.style.display = 'flex';
          div.style.display = 'none'
          ul.innerHTML = `<ul>${tpl}</ul>`;
            
        }
        else if (users.length > 10) {
          Notify.info(
            `"Too many matches found. Please enter a more specific name."`
          );
          ul.style.display = 'none';
          div.style.display = 'none';
        }
        else if (users.length === 1) {
          const tpl = users.map(
            user =>
              `
                <div class="list"> 
                <img src="${user.flags.svg}"
                 alt="Flag of ${user.name.common}" 
                 width="50" height="30">${user.name.common}
                 </div>
                 <div class="list"> <br>
                 <h6>Capital: </h6>   ${user.capital} 
                 </div>
                 <div class="list"> 
                 <h6>Population: </h6>   ${user.population} 
                 </div>
                 <div class="list"> 
                 <h6>Languages: </h6>   ${Object.values(user.languages).join(
                ', '
              )}
                 </div> `
            //languages es un objeto por lo que pueden haber varios idiomas
          );
          div.style.display = 'flex';
          ul.style.display = 'none';
          div.innerHTML = `${tpl}`;
        }
          
          
      }).catch(error => {
        Notify.failure(error)
          ul.style.display = 'none';
          div.style.display = 'none';
      });
  }
};

const debouncedHandleInput = debounce(handleInput, DEBOUNCE_DELAY);
inputText.addEventListener('input', debouncedHandleInput);

const numberChildValid = numberOfChildren => {
  console.log(numberOfChildren);
  if (numberOfChildren > 0) {
    console.log(numberOfChildren);
    return true;
  } else return false;
};
