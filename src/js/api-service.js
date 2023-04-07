import axios from "axios";
import { Notify } from "notiflix";

export  class ImagesApiService {
  static BASE_URL = "https://pixabay.com/api/";
  static API_KEY = "35064205-67d7ade1ddd64ae7932467e42";
  constructor() {
    this.query = null;
    this.page = 1;
  }

  async fetchImages() {
    const searchParams = new URLSearchParams({
      key: ImagesApiService.API_KEY,
      q: encodeURIComponent(`${this.query}`),
      image_type: "photo",
      orientation: "horizontal",
      safesearch: true,
      page: this.page,
      per_page: 40,
    });
    const URL = `${ImagesApiService.BASE_URL}?${searchParams}`;
    const response = await axios.get(URL);
    const result = response.data;
    return result;
  }
}


// export default async function fetchImages(searchQuery, page) {
//   const API_KEY = "35064205-67d7ade1ddd64ae7932467e42";
//   const BASE_URL = "https://pixabay.com/api/";
//   searchParams = new URLSearchParams({
//     key: API_KEY,
//     q: encodeURIComponent(`${searchQuery}`),
//     image_type: "photo",
//     orientation: "horizontal",
//     safesearch: true,
//     page: page,
//     per_page: 40,
//   });
//   const URL = `${BASE_URL}?${searchParams}`;
//   const response = await axios.get(URL);
//   const result = response.data;
//   return result;
// }

