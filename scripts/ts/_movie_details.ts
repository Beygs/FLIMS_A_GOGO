export interface Movie {
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

export class MovieDetails {
  constructor(private _movie: Movie, private _modal: HTMLElement) {}

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