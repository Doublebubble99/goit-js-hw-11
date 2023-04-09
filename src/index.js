import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
var axios = require('axios/dist/browser/axios.cjs');
// var lightbox = new SimpleLightbox('.gallery a', {});
// lightbox.on('show.simplelightbox', () => {
//   lightbox.show();
// });
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  loadMore: document.querySelector('.load-more'),
};
async function totalHits() {
  await getImages(input.value)
    .then(res => res.totalHits)
    .then(val => {
      Notiflix.Notify.success(`Hooray! We found ${val} images.`);
      return val;
    });
}
function reset() {
  page = 1;
  gallery.innerHTML = '';
}
const { searchForm, gallery, input, loadMore } = refs;
let page = 1;
loadMore.classList.add('is-hidden');
searchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  loadMore.classList.add('is-hidden');
  queryPictures(input.value);
  reset();
});
loadMore.addEventListener('click', getMoreContent);
/////////////////////////////////
async function getImages(name) {
  const API_KEY = '35065203-c3198a287b2074eded36e9961';
  const params = new URLSearchParams({
    key: API_KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  }).toString();
  const url = `https://pixabay.com/api/?${params}`;
  try {
    const response = await axios.get(url).then(res => res.data);
    return response;
  } catch (error) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMore.classList.add('is-hidden');
  }
}
///////////////////////////
function renderPageByName(cards) {
  const cardList = cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <img src=${webformatURL} alt=${tags} loading="lazy" />
  <div class="info">
    <p class="info-item">Likes
      <b>${likes}</b>
    </p>
    <p class="info-item">Views
      <b>${views}</b>
    </p>
    <p class="info-item">Comments
      <b>${comments}</b>
    </p>
    <p class="info-item">Downloads
      <b>${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', cardList);
}
/////////////////////
async function getMoreContent() {
  page += 1;
  await getImages(input.value)
    .then(val => val.hits)
    .then(res => {
      if (res.length < 40) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMore.classList.add('is-hidden');
      }
      renderPageByName(res);
      lightbox.refresh();
    })
    .catch(error => {
      if (error.response) {
        return;
      }
    });
}
/////////////////////
async function queryPictures(name) {
  await getImages(input.value)
    .then(val => val.hits)
    .then(res => {
      if (name.trim().length === 0 || res.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMore.classList.add('is-hidden');
        return;
      }
      renderPageByName(res);
      loadMore.classList.remove('is-hidden');
    })
    .catch(error => {
      if (error.request) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        loadMore.classList.add('is-hidden');
      }
    });
}
