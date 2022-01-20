export class MovieDetails {
    constructor(_movie, _modal) {
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
        this.modal.classList.add("active");
    }
}
