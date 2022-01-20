import { ENV } from "./env.js";

declare const Splitting: () => void;

Splitting();

const movies = document.querySelector(".movies-section");
const form = document.querySelector("form");

interface Movie {
  Actors: string;
  Awards: string;
  BoxOffice: string;
  Country: string;
  Director: string;
  Genre: string;
  Language: string;
  Plot: string;
  Poster: string;
  Production: string;
  Rated: string;
  Ratings: { Source: string; Value: string; }[];
  Released: string;
  Title: string;
  Type: string;
  Writer: string;
  Year: string;
  Response: "True" | "False";
  imdbID: string;
  [key: string]: any;
}

const searchMovie = (search: string, page = 1): void => {
  const url = `http://www.omdbapi.com/?apikey=${ENV["OMDB_KEY"]}&s=${search}&p=${page}`;
  console.log(url);

  fetch(url)
    .then(response => response.json())
    .then(result => result.Search.forEach(movie => movieDetails(movie.Title)))
    .catch(error => console.error("Oups ! Une erreur a été rencontrée =>" + error));
}

const movieDetails = (movieTitle: string): void => {
  const url = `http://www.omdbapi.com/?apikey=${ENV["OMDB_KEY"]}&t=${movieTitle}`;

  fetch(url)
    .then(response => response.json())
    .then(result => { if (result.Response === "True") showMovie(result) })
    .then(() => lazyLoadImages())
    .catch(error => console.error("Oups ! Une erreur a été rencontrée =>" + error));
  }
  
const showMovie = (movie: Movie): void => {
  const { Poster, Title, Type, Year, imdbID } = movie;
  
  movies.innerHTML += `
  <div class="movie">
    <img data-src="${Poster !== "N/A" ? Poster : "./camera.jpg"}" src="./camera.jpg" alt="Movie Poster" class="movie__poster lazy-image">
    <h3 class="movie__title">${Title}</h3>
    <h4 class="movie__type">${Type}</h4>
    <h4 class="movie__year">${Year}</h4>
    <a href="#" id="more-${imdbID}">En savoir plus</a>
  </div>
  `

  const knowMoreBtn = document.getElementById(`more-${imdbID}`);

  knowMoreBtn.addEventListener("click", () => knowMore(movie));
  
  movies.scrollIntoView({ behavior: "smooth" });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  
  const input: HTMLInputElement = form.querySelector("#movieSearch");
  movies.innerHTML = "";
  
  searchMovie(input.value);

});

const knowMore = (movie: Movie): void => {
  console.log(movie);
}


interface IntersectionObserverEntryImg extends Omit<IntersectionObserverEntry, "target"> {
  target: HTMLImageElement;
}

const lazyLoadImages = (): void => {
  const imageObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach((entry: IntersectionObserverEntryImg) => {
      if(entry.isIntersecting) {
        const lazyImg = entry.target;
        lazyImg.src = lazyImg.dataset.src;
        lazyImg.classList.remove("lazy-image");
        imgObserver.unobserve(lazyImg);
      }
    });
  });
  
  const posters = document.querySelectorAll(".lazy-image")
  
  posters.forEach((poster: HTMLImageElement) => imageObserver.observe(poster));
}