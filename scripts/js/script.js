import { MovieDetails, typeTrad } from "./_movie_details.js";
import { ENV } from "../env.js";
Splitting();
const main = document.querySelector("main");
const searchSection = document.querySelector(".search-section");
const moviesSection = document.querySelector(".movies-section");
const form = document.querySelector("form");
const input = form.querySelector("#movieSearch");
const modal = document.querySelector(".modal");
const arrowUp = document.querySelector(".arrow-up");
let movies = document.querySelectorAll(".movie");
let page = 1;
let moviesArray = [];
const searchMovie = (search) => {
    const url = `https://www.omdbapi.com/?apikey=${ENV["OMDB_KEY"]}&s=${search}&page=${page}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(result => result.Search.forEach(movie => movieDetails(movie.Title)))
        .catch(error => console.error("Oups ! Une erreur a été rencontrée =>" + error));
};
const movieDetails = (movieTitle) => {
    const url = `https://www.omdbapi.com/?apikey=${ENV["OMDB_KEY"]}&t=${movieTitle}`;
    fetch(url)
        .then(response => response.json())
        .then(result => { if (result.Response === "True")
        showMovie(result); })
        .then(() => {
        lazyLoadImages();
        moviesObserver();
    })
        .catch(error => console.error("Oups ! Une erreur a été rencontrée =>" + error));
};
const showMovie = (movie) => {
    const { Poster, Title, Type, Year, imdbID } = movie;
    moviesSection.innerHTML += `
  <div class="movie">
    <img data-src="${Poster !== "N/A" ? Poster : "./assets/no_poster.png"}" src="./no_poster.png" alt="Movie Poster" class="movie__poster lazy-image">
    <div class="movie__infos">
      <h3 class="movie__title">${Title}</h3>
      <h4>
        <span class="movie__type">${typeTrad[Type]}</span>
        <span class="movie__year">${Year}</span>
      </h4>
      <div id="${imdbID}" class="movie__more">En savoir plus</div>
    </div>
  </div>
  `;
    moviesArray.push(new MovieDetails(movie, modal));
    moviesObserver();
    const knowMoreBtns = document.querySelectorAll(".movie__more");
    knowMoreBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const movieId = btn.id;
            const movieDetails = moviesArray.find(m => m.imdbID === movieId);
            main.classList.add("blurred");
            document.body.style.overflowY = "hidden";
            movieDetails.knowMore();
        });
    });
    moviesSection.scrollIntoView({ behavior: "smooth" });
    arrowUpObserver.observe(moviesSection.querySelector(".movie"));
};
form.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    moviesSection.innerHTML = "";
    moviesArray = [];
    searchMovie(input.value);
    return false;
});
const blocker = modal.querySelector(".modal__blocker");
blocker.addEventListener("click", () => {
    modal.classList.remove("active");
    main.classList.remove("blurred");
    document.body.style.overflowY = "auto";
});
const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, imgObserver) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const lazyImg = entry.target;
                lazyImg.src = lazyImg.dataset.src;
                lazyImg.classList.remove("lazy-image");
                imgObserver.unobserve(lazyImg);
            }
        });
    });
    const posters = document.querySelectorAll(".lazy-image");
    posters.forEach((poster) => imageObserver.observe(poster));
};
let prevRatio = 0.0;
const arrowUpObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > prevRatio) {
            arrowUp.setAttribute("style", "visibility: visible; opacity: 1");
        }
        prevRatio = entry.intersectionRatio;
    });
}, {
    threshold: [0, 0.5]
});
const arrowHideObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.intersectionRatio > 0.95) {
            arrowUp.setAttribute("style", "visibility: hidden; opacity: 0");
        }
    });
}, {
    threshold: [0.95, 1]
});
arrowHideObserver.observe(searchSection);
arrowUp.addEventListener("click", () => {
    window.scroll({ top: 0, left: 0, behavior: "smooth" });
});
const moviesIntersectionObserver = new IntersectionObserver(entries => {
    entries.forEach((entry) => {
        if (entry.intersectionRatio > 0.25 && entry.target.id === "lastMovie") {
            page++;
            searchMovie(input.value);
        }
        if (entry.intersectionRatio > 0.25) {
            entry.target.classList.add("visible");
        }
    });
}, {
    threshold: [0.25]
});
const moviesObserver = () => {
    movies.forEach(movie => {
        moviesIntersectionObserver.unobserve(movie);
        movie.id = "";
    });
    movies = document.querySelectorAll(".movie");
    movies[movies.length - 1].id = "lastMovie";
    movies.forEach(movie => moviesIntersectionObserver.observe(movie));
};
