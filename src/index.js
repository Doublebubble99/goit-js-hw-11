import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getImages } from '../src/GetImages';
var lightbox = new SimpleLightbox('.gallery a', {
  animationSpeed: 250,
  fadeSpeed: 250,
});
export let page = 1;
export let per_page = 40;
let lastPage = 0;
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  input: document.querySelector('input'),
  loadMore: document.querySelector('.load-more'),
};
const { searchForm, gallery, input, loadMore } = refs;
lightbox.on('show.simplelightbox', () => {
  lightbox.shown();
});
function reset() {
  page = 1;
  gallery.innerHTML = '';
}
loadMore.classList.add('is-hidden');
searchForm.addEventListener('submit', async evt => {
  evt.preventDefault();
  reset();
  loadMore.classList.add('is-hidden');
  await queryPictures(input.value.trim());
});
loadMore.addEventListener('click', async () => {
  page += 1;
  await queryPictures(input.value.trim());
});
async function queryPictures(name) {
  if (name === '') {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  const response = await getImages(name);
  lastPage = Math.ceil(response.data.totalHits / per_page);
  if (response.data.totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  renderPageByName(response.data);
}
function renderPageByName(cards) {
  const cardList = cards.hits
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

  if (cards.hits.length < 40 && page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
    loadMore.classList.add('is-hidden');
    lightbox.refresh();
    return;
  } else if (page === 1) {
    Notiflix.Notify.success(`Hooray! We found ${cards.totalHits} images.`);
  } else if (page === lastPage) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    loadMore.classList.add('is-hidden');
    lightbox.refresh();
    return;
  }
  lightbox.refresh();
  loadMore.classList.remove('is-hidden');
}
