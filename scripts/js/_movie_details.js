export const typeTrad = {
    movie: "flim",
    series: "paflim"
};
const ratedIcons = {
    G: "mpaa-g",
    PG: "mpaa-pg",
    "PG-13": "mpaa-pg13",
    R: "mpaa-r",
    "NC-17": "mpaa-nc17",
    "Not Rated": "mpaa-nr",
    "N/A": "mpaa-unrated",
    "TV-Y": "tv-y",
    "TV-Y7": "tv-y7",
    "TV-Y7FG": "tv-y7fg",
    "TV-G": "tv-g",
    "TV-PG": "tv-pg",
    "TV-14": "tv-14",
    "TV-MA": "tv-ma"
};
export class MovieDetails {
    constructor(_movie, _modal, flag) {
        this._movie = _movie;
        this._modal = _modal;
    }
    get movie() {
        return this._movie;
    }
    get imdbID() {
        return this._movie.imdbID;
    }
    get modal() {
        return this._modal;
    }
    knowMore() {
        if (this.movie.Country === "USA")
            this.movie.Country = "United States";
        const { Actors, Awards, BoxOffice, Country, Director, Genre, Plot, Poster, Rated, Runtime, Title, Type, Writer, Year } = this.movie;
        this.modal.classList.add("active");
        const cardContent = this.modal.querySelector(".modal__card .content");
        let countryFlag;
        try {
            countryFlag = countryFlagEmoji.list.find(data => data.name === Country.split(",")[0]).emoji;
        }
        catch (e) {
            countryFlag = "🏳️";
        }
        cardContent.innerHTML = `
    <div class="card__header"></div>
    <h3 class="title">${Title}</h3>
    <span class="type">(${typeTrad[Type]})</span>
    <p class="details">
      <span class="year">${Year}</span>&#32;
      <span class="genre">${Genre}</span>&#32;
      <span class="duration">${Runtime}</span>&#32;
      <img class="rated" src="/assets/${ratedIcons[Rated]}.png">&#32; 
    </p>
    <p class="director">🎬 Réalisateur(s): ${Director}</p>
    <p class="actors">🎥 Acteurs: ${Actors}</p>
    <p class="writer">🗒️ Auteur(s): ${Writer}</p>
    <p class="country">${countryFlag} Pays: ${Country}</p>
    <p class="box-office">🤑 Moula engrangée: ${BoxOffice}</p>
    <p class="awards">🏆 Prix: ${Awards}</p>
    <p class="plot">${Plot}</p>
    `;
    }
}
