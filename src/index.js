import './css/styles.css';
import { Notify } from 'notiflix';
import { myValue } from './key';
import $ from 'jquery';
import axios from 'axios';
import 'simplelightbox/dist/simple-lightbox.min.css';
import SimpleLightbox from 'simplelightbox';

const div = document.querySelector('div');
const searchInput = document.querySelector('.search');
const send = document.querySelector('.send');
const btnBack = document.querySelector('.btnBack');
const btnNext = document.querySelector('.btnNext');
const lightbox = new SimpleLightbox('.gallery a');

const renderPhotoCard = (img, likes, views, comments, downloads) => {
  return `<div class="photo-card">
    <a href="${img}" class="gallery"><img src="${img}" alt="" loading="lazy" width="100px" heigth="100px" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes: </b>
        <strong> ${likes} </strong>
      </p>
      <p class="info-item">
        <b>Views: </b>
        <strong> ${views} </strong>
      </p>
      <p class="info-item">
        <b>Comments: </b>
        <strong> ${comments} </strong>
      </p>
      <p class="info-item">
        <b>Downloads: </b>
        <strong> ${downloads} </strong>
      </p>
    </div>
  </div>`;
};

const API_KEY = myValue;

// Páginas a recuperar
let page = 1;
let per_page = 20;
let page_actual = page * per_page;
let total_page;

const results = async () => {
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${searchInput.value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}`;
  try {
    const response = await axios.get(URL);
    const { data } = response;
    if (parseInt(data.totalHits) > 0) {
      total_page = data.totalHits;
      const photoCards = data.hits.map(hit => {
        return renderPhotoCard(
          hit.largeImageURL,
          hit.likes,
          hit.views,
          hit.comments,
          hit.downloads
        );
      });
      div.innerHTML = photoCards.join('');
      lightbox.refresh();

      if (page === 1) {
        btnBack.style.display = 'flex';
        btnNext.style.display = 'flex';
      }
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (error) {
    Notify.failure('error');
  }
};

send.addEventListener('click', e => {
  e.preventDefault();
  if (searchInput.value === '') {
    Notify.warning('input invalid');
  } else {
    results();
  }
});

btnBack.addEventListener('click', () => {
  if (page === 1) {
    Notify.warning('is in the first');
  } else {
    page -= 1;
    results();
  }
});

btnNext.addEventListener('click', () => {
  if (page_actual >= total_page) {
    Notify.failure('Hooray! We found totalHits images.');
  } else {
    page += 1;
    results();
    page_actual = per_page * page;

    setTimeout(() => {
      document.querySelector('div').scrollIntoView({ behavior: 'smooth' });
    }, 2000);
  }
});
