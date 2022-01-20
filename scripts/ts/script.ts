import { ENV } from "../env.js";
import { Movie, MovieDetails } from "./_movie_details.js";

declare const Splitting: () => void;

Splitting();

const movies = document.querySelector(".movies-section");
const form = document.querySelector("form");
const modal = document.querySelector(".modal");

const moviesArray: MovieDetails[] = [];

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

  const typeTrad = {
    movie: "flim",
    series: "paflim"
  }
  
  movies.innerHTML += `
  <div class="movie">
    <img data-src="${Poster !== "N/A" ? Poster : "./no_poster.png"}" src="./no_poster.png" alt="Movie Poster" class="movie__poster lazy-image">
    <div class="movie__infos">
      <h3 class="movie__title">${Title}</h3>
      <h4>
        <span class="movie__type">${typeTrad[Type]}</span>
        <span class="movie__year">${Year}</span>
      </h4>
      <div id="${imdbID}" class="movie__more">En savoir plus</div>
    </div>
  </div>
  `

  moviesArray.push(new MovieDetails(movie, modal));

  const knowMoreBtns = document.querySelectorAll(".movie__more");

  knowMoreBtns.forEach((btn: HTMLElement) => {
    btn.addEventListener("click", () => {
      const movieId = btn.id;

      const movieDetails = moviesArray.find(m => m.imdbID === movieId);

      movieDetails.knowMore();
    })
  })
  
  movies.scrollIntoView({ behavior: "smooth" });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  
  const input: HTMLInputElement = form.querySelector("#movieSearch");
  movies.innerHTML = "";
  
  searchMovie(input.value);
});


const blocker = modal.querySelector(".modal__blocker");

blocker.addEventListener("click", () => {
  modal.classList.remove("active");
})


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
