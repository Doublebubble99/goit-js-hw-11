import { page, per_page } from './index';
import axios from 'axios';
function getImages(name) {
  const API_KEY = '35065203-c3198a287b2074eded36e9961';
  const params = new URLSearchParams({
    key: API_KEY,
    q: name,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page,
  });
  const url = `https://pixabay.com/api/?${params}`;

  const response = axios.get(url);
  return response;
}
export { getImages };
