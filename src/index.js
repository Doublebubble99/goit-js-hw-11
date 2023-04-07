import Notiflix from 'notiflix';
import axios from 'axios';
const axios = require('axios').all;
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  loadMore: document.querySelector('.load-more'),
};
async function hits() {
  const hits = await getImages(input.value).then(res => res.hits);
  return hits;
}
async function totalHits() {
  const totalHits = await getImages(input.value).then(res => res.totalHits);
  console.log(totalHits);
  return totalHits;
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
  reset();
  totalHits();
  queryPictures(input.value);
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
    const response = await axios
      .get(url)
      .then(res => {
        return res.data;
      })
      .catch(error => {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMore.classList.add('is-hidden');
      });
    return response;
  } catch (error) {
    console.error(error.message);
  }
}
///////////////////////////
async function renderPageByName(cards) {
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
  <img src=${webformatURL} srcset=${largeImageURL} alt=${tags} loading="lazy" />
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
  const nums = await getImages(input.value).then(hits);
  getImages(input.value)
    .then(hits)
    .then(res => {
      if (nums.length < 40 || totalHits.length) {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMore.classList.add('is-hidden');
      }
      renderPageByName(res);
    });
}
/////////////////////
async function queryPictures(name) {
  const nums = await getImages(input.value).then(hits);
  if (name.trim().length === 0 || nums.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMore.classList.add('is-hidden');
    return;
  }
  getImages(input.value)
    .then(hits)
    .then(async res => {
      await renderPageByName(res);
      loadMore.classList.remove('is-hidden');
    });
}
