import { ENV } from "./env.js";
Splitting();
var movies = document.querySelector(".movies-section");
var form = document.querySelector("form");
var searchMovie = function (search, page) {
    if (page === void 0) { page = 1; }
    var url = "http://www.omdbapi.com/?apikey=".concat(ENV["OMDB_KEY"], "&s=").concat(search, "&p=").concat(page);
    console.log(url);
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (result) { return result.Search.forEach(function (movie) { return movieDetails(movie.Title); }); })["catch"](function (error) { return console.error("Oups ! Une erreur a été rencontrée =>" + error); });
};
var movieDetails = function (movieTitle) {
    var url = "http://www.omdbapi.com/?apikey=".concat(ENV["OMDB_KEY"], "&t=").concat(movieTitle);
    fetch(url)
        .then(function (response) { return response.json(); })
        .then(function (result) { if (result.Response === "True")
        showMovie(result); })
        .then(function () { return lazyLoadImages(); })["catch"](function (error) { return console.error("Oups ! Une erreur a été rencontrée =>" + error); });
};
var showMovie = function (movie) {
    var Poster = movie.Poster, Title = movie.Title, Type = movie.Type, Year = movie.Year, imdbID = movie.imdbID;
    movies.innerHTML += "\n  <div class=\"movie\">\n    <img data-src=\"".concat(Poster !== "N/A" ? Poster : "./camera.jpg", "\" src=\"./camera.jpg\" alt=\"Movie Poster\" class=\"movie__poster lazy-image\">\n    <h3 class=\"movie__title\">").concat(Title, "</h3>\n    <h4 class=\"movie__type\">").concat(Type, "</h4>\n    <h4 class=\"movie__year\">").concat(Year, "</h4>\n    <a href=\"#\" id=\"more-").concat(imdbID, "\">En savoir plus</a>\n  </div>\n  ");
    var knowMoreBtn = document.getElementById("more-".concat(imdbID));
    knowMoreBtn.addEventListener("click", function () { return knowMore(movie); });
    movies.scrollIntoView({ behavior: "smooth" });
};
form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = form.querySelector("#movieSearch");
    movies.innerHTML = "";
    searchMovie(input.value);
});
var knowMore = function (movie) {
    console.log(movie);
};
var lazyLoadImages = function () {
    var imageObserver = new IntersectionObserver(function (entries, imgObserver) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var lazyImg = entry.target;
                lazyImg.src = lazyImg.dataset.src;
                lazyImg.classList.remove("lazy-image");
                imgObserver.unobserve(lazyImg);
            }
        });
    });
    var posters = document.querySelectorAll(".lazy-image");
    posters.forEach(function (poster) { return imageObserver.observe(poster); });
};
