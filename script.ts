import { ENV } from "./env.js";

const movies = document.querySelector(".movies");
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
  
  const showMovie = (movieInfos: Movie): void => {
    const { Poster, Title, Type, Year } = movieInfos;
    
    movies.innerHTML += `
    <div class="movie">
    <img data-src="${Poster !== "N/A" ? Poster : "./camera.jpg"}" src="./camera.jpg" alt="Movie Poster" class="movie__poster">
    <h3 class="movie__title">${Title}</h3>
    <h4 class="movie__type">${Type}</h4>
      <h4 class="movie__year>${Year}</h4>
      </div>
  `
}

form.addEventListener("submit", e => {
  e.preventDefault();
  
  const input: HTMLInputElement = form.querySelector("#movieSearch");
  movies.innerHTML = "";
  
  searchMovie(input.value);
});

const lazyLoadImages = () => {
  const imageObserver = new IntersectionObserver((entries, imgObserver) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        const lazyImg = entry.target;
        lazyImg.src = lazyImg.dataset.src;
      }
    });
  });
  
  const posters = document.querySelectorAll(".movie__poster")
  
  posters.forEach(poster => imageObserver.observe(poster));
}