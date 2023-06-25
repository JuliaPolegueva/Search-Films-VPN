import React from 'react';
import { Tabs } from 'antd';

import SwapiService from '../../services/SwapiService';
import SearchBar from '../SearchBar';
import MovieCardsList from '../MovieCardsList';
import RatedMovieCardsList from '../RatedMovieCardsList/RatedMovieCardsList';
//import { SwapiServiceProvider } from '../SwapiServiceContext/SwapiServiceContext';
import { MoviesGenresProvider } from '../MoviesGenres/MoviesGenres';

import './App.css';

class App extends React.Component {
  swapiService = new SwapiService();
  genres = [];

  state = {
    sessionId: null,
    moviesList: null,
    totalPages: null,
    pageMovie: 1,

    moviesListRated: null,
    totalPagesRated: null,
    pageMovieRated: 1,

    loading: false,
    error: false,
    rate: null,
  };

  componentDidMount() {
    this.getGenres();

    this.swapiService
      .createdGuestSession()
      .then(res =>
        this.setState({
          sessionId: res,
        })
      )
      .catch(this.onError);
  }

  //Жанры

  getGenres = () => {
    this.swapiService
      .getMoviesGenres()
      .then(res => {
        this.genres = res;
      })
      .catch(this.onError);
  };

  //Если есть ошибка

  onError = err => {
    this.setState({
      error: true,
      loading: false,
    });
    alert(`Произошла ошибка: ${err}`);
  };

  //Данные фильмов полностью загружены

  onMovieLoaded = moviesData => {
    const [moviesList, totalPages] = [...moviesData];

    this.setState({
      moviesList: moviesList,
      totalPages: totalPages,
      loading: false,
      error: false,
    });
  };

  //Данные рейтинговых фильмов полностью загружены

  onRatedMovieLoaded = moviesData => {
    const [moviesListRated, totalPagesRated] = [...moviesData];

    this.setState({
      moviesListRated: moviesListRated,
      totalPagesRated: totalPagesRated,
      loading: false,
      error: false,
    });
  };

  //Загрузка данных

  onLoading = () => {
    this.setState({
      loading: true,
    });
  };

  //Изменение страницы

  changePageMovie = pageMovie => {
    this.setState({
      pageMovie: pageMovie,
    });
  };

  changePageRate = pageMovieRated => {
    this.setState({
      pageMovieRated: pageMovieRated,
    });
  };

  //Изменение рэйтинга

  changeRate = rate => {
    this.setState({ rate: rate });
  };

  //Рендер карточек фильмов

  changeTab = key => {
    if (key === '2')
      this.swapiService
        .getRatedMovies(this.state.sessionId, this.state.pageMovieRated)
        .then(this.onRatedMovieLoaded)
        .catch(this.onError);
  };

  render() {
    return (
      <MoviesGenresProvider value={this.genres}>
        <div className="movie-app">
          <div className="main">
            <Tabs
              defaultActiveKey="1"
              centered
              destroyInactiveTabPane={false}
              onChange={this.changeTab}
              items={[
                {
                  label: 'Search',
                  key: '1',
                  children: (
                    <React.Fragment>
                      <SearchBar
                        onError={this.onError}
                        onMovieLoaded={this.onMovieLoaded}
                        onLoading={this.onLoading}
                        changePage={this.changePageMovie}
                        page={this.state.pageMovie}
                      />
                      <MovieCardsList {...this.state} changeRate={this.changeRate} changePage={this.changePageMovie} />
                    </React.Fragment>
                  ),
                },
                {
                  label: 'Rated',
                  key: '2',
                  children: (
                    <React.Fragment>
                      <RatedMovieCardsList
                        {...this.state}
                        onError={this.onError}
                        onRatedMovieLoaded={this.onRatedMovieLoaded}
                        onLoading={this.onLoading}
                        changeRate={this.changeRate}
                        changePage={this.changePageRate}
                      />
                    </React.Fragment>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </MoviesGenresProvider>
    );
  }
}

export default App;
