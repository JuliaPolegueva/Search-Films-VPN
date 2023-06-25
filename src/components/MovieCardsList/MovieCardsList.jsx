import React from 'react';
import { Offline, Online } from 'react-detect-offline';
import { Pagination } from 'antd';

import MovieCard from '../MovieCard/MovieCard';
import SwapiService from '../../services/SwapiService';
import Spinner from '../Spinner/Spinner';

import './MovieCardsList.css';

class MovieCardsList extends React.Component {
  swapiService = new SwapiService();

  //Рендер карточек фильмов

  renderItems = arr => {
    return arr.map(movie => {
      return (
        <MovieCard
          key={movie.id}
          {...movie}
          rate={this.props.rate}
          sessionId={this.props.sessionId}
          addRating={this.swapiService.addRating}
          changeRate={this.props.changeRate}
        />
      );
    });
  };

  render() {
    const { moviesList, totalPages, pageMovie, loading, error, changePage } = this.props;
    const results = moviesList && !(error || loading);
    const noResults = results && moviesList.length === 0;

    const spinner = loading ? <Spinner /> : null;
    const content = results && moviesList.length > 0 ? this.renderItems(moviesList) : null;
    const noContent = noResults ? <span className="no-results">По вашему запросу ничего не найдено</span> : null;

    const pagination =
      totalPages > 1 && !(error || loading) ? (
        <Pagination defaultCurrent={pageMovie} total={totalPages} onChange={changePage} defaultPageSize={1} />
      ) : null;

    return (
      <React.Fragment>
        <Online>
          <ul className={loading || noResults ? 'card-list card-list-loading' : 'card-list'}>
            {spinner}
            {noContent}
            {content}
          </ul>
          {pagination}
        </Online>
        <Offline>
          <span className="no-connection">Нет доступа к интернету, проверьте подключение</span>
        </Offline>
      </React.Fragment>
    );
  }
}

export default MovieCardsList;

/*<React.Fragment>
        <Online>
          <ul className={loading || noResults ? 'card-list card-list-loading' : 'card-list'}>
            {spinner}
            {noContent}
            {content}
          </ul>
          {pagination}
        </Online>
        <Offline>
          <span className="no-connection">Нет доступа к интернету, проверьте подключение</span>
        </Offline>
      </React.Fragment>*/
