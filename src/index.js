import galleryMarkup from "./js/templates/gallery-markup.hbs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { searchForm, galleryList, observerEl } from "./js/refs";
import { ImagesApiService } from "./js/api-service";

const imagesApiservice = new ImagesApiService();
let isShown = 0;
const options = {
  root: null,
  rootMargin: "0px 0px 0px 0px",
  threshold: 1.0,
};
const observer = new IntersectionObserver(onLoadMoreBtn, options);


console.log(imagesApiservice);

function onSearchForm(evt) {
  evt.preventDefault();
  isShown = 0;

  imagesApiservice.query = evt.target.elements.searchQuery.value;
  imagesApiservice.page = 1;
  imagesApiservice
    .fetchImages()
    .then((data) => {
      console.log(data);
      if ((data.query = "")) {
        Notify.warning(`Please, fill the main field'`);
        return;
      }
      if (data.total === 0) {
        galleryList.innerHTML = "";
        throw new Error(
          "Sorry, there are no images matching your search query. Please try again."
        );
      }

      if (data.totalHits === 1) {
        galleryList.innerHTML = galleryMarkup(data.hits);
        return;
      }
      Notify.success(`Hooray! We found ${data.total} images.`)
      galleryList.innerHTML = galleryMarkup(data.hits);
      gallery.refresh();
      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        behavior: "smooth",
      });
      setTimeout(() => {
        observer.observe(observerEl);
      }, 500)
    })
    .catch((err) => Notify.failure(err.message));
}

function onLoadMoreBtn(evt) {
  imagesApiservice.page += 1;
  console.log("we are here");
  imagesApiservice
    .fetchImages()
    .then((data) => {
      isShown = ((imagesApiservice.page - 2) * 40) + 1;
      console.log(isShown);
      console.log(isShown >= data.totalHits);
      
      if (isShown >= data.totalHits) {
        onReachedResults();
        observer.unobserve(observerEl)
        return;
      }

      console.log(data);
      galleryList.insertAdjacentHTML("beforeend", galleryMarkup(data.hits));
    })
    .catch((err) => console.log(err));
}

function onReachedResults() {
  return Notify.info(
    `We're sorry, but you've reached the end of search results.`
  );
}

let gallery = new SimpleLightbox(".gallery a", {
  captionsData: "alt",
  captionDelay: 250,
});

searchForm.addEventListener("submit", onSearchForm);
