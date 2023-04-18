import { page, per_page } from './index';
import Notiflix from 'notiflix';
import axios from 'axios';
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
    const response = (await axios.get(url)).data;
    return response;
  } catch (error) {
    Notiflix.Notify.failure('Something go wrong');
  }
}
export { getImages };
