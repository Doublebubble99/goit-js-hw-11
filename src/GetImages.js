import { page, loadMore, input, per_page } from './index';
import Notiflix from 'notiflix';
import axios from 'axios';
var axios = require('axios/dist/browser/axios.cjs');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
async function getImages(name) {
  const API_KEY = '35065203-c3198a287b2074eded36e9961';
  const params = new URLSearchParams({
    key: API_KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page,
  }).toString();
  const url = `https://pixabay.com/api/?${params}`;
  try {
    const lastPage = 13;
    const response = await axios
      .get(url)
      .then(res => res.data)
      .then(val => {
        if (page === 1 && val.totalHits !== 0 && name) {
          Notiflix.Notify.success(`Hooray! We found ${val.totalHits} images.`);
        }
        loadMore.classList.remove('is-hidden');
        return val.hits;
      });
    if (!response.length || !input.value.trim()) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMore.classList.add('is-hidden');
      return;
    }
    if (response.length < 40 || page === lastPage) {
      loadMore.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    return response;
  } catch (error) {
    Notiflix.Notify.failure('Something go wrong');
  }
}
export { getImages };
