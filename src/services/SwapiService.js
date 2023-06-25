export default class SwapiService {
  _apiBase = 'https://api.themoviedb.org/3';
  _apiKey = 'd6a5629cd21915972815b7673d58a73e';

  async getResource(url, options = null) {
    const res = await fetch(`${this._apiBase}${url}`, options);

    if (!res.ok) {
      throw new Error(`Could not fetch, received ${res.status}`);
    }

    return await res.json();
  }

  //Гостевая сессия

  async createdGuestSession() {
    const res = await this.getResource(`/authentication/guest_session/new?api_key=${this._apiKey}`);
    return res.guest_session_id;
  }

  //Получение жанров

  async getMoviesGenres() {
    const res = await this.getResource(`/genre/movie/list?api_key=${this._apiKey}&language=ru`);
    return res.genres;
  }

  //Получение списка фильмов

  async getMovies(query, page) {
    const res = await this.getResource(
      `/search/movie?api_key=${this._apiKey}&include_adult=false&query=${query}&language=ru-RU&page=${page}`
    );

    const movies = res.results.map(this._transformMovie);
    const totalPages = res.total_pages;

    return [movies, totalPages];
  }

  //Получение списка рэйтинговых фильмов

  //Исправить page

  async getRatedMovies(sessionId, page) {
    const res = await this.getResource(`/guest_session/${sessionId}/rated/movies?api_key=${this._apiKey}&page=${page}`);

    const movies = res.results.map(this._transformMovie);
    const totalPages = res.total_pages;

    return [movies, totalPages];
  }

  //Добавление рэйтинга к фильму

  addRating = async (rate, sessionId, movieId) => {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: `{"value": ${rate}}`,
    };

    await this.getResource(`/movie/${movieId}/rating?api_key=${this._apiKey}&guest_session_id=${sessionId}`, options);
    this._movieRate[movieId] = rate;

    return this._movieRate;
  };

  _transformMovie(movie) {
    return {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      overview: movie.overview,
      posterPath: movie.poster_path,
      voteAverage: movie.vote_average.toFixed(1),
      genreIds: movie.genre_ids,
    };
  }

  _movieRate = {};
}
