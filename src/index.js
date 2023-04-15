import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchQuantity, getImages } from './getImages';
var axios = require('axios/dist/browser/axios.cjs');
var lightbox = new SimpleLightbox('.gallery a', {
  animationSpeed: 250,
  fadeSpeed: 250,
});
export let page = 1;
export let per_page = 40;
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  loadMore: document.querySelector('.load-more'),
};
export const { searchForm, gallery, input, loadMore } = refs;
lightbox.on('show.simplelightbox', () => {
  lightbox.shown();
});
function reset() {
  page = 1;
  gallery.innerHTML = '';
}
loadMore.classList.add('is-hidden');
searchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  reset();
  loadMore.classList.add('is-hidden');
  queryPictures(input.value.trim());
});
loadMore.addEventListener('click', () => {
  getMoreContent();
});
export async function getMoreContent() {
  page += 1;
  loadMore.classList.remove('is-hidden');
  renderPageByName(await getImages(input.value.trim()));
}
export async function queryPictures(name) {
  renderPageByName(await getImages(name));
}
export async function renderPageByName(cards) {
  const cardList = await cards
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
        return `<a href=${largeImageURL}><div class="photo-card">
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
</div></a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', cardList);
  lightbox.refresh();
}
