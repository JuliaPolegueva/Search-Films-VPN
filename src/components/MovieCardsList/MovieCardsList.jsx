import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, Alert } from 'antd';

import MovieCard from '../MovieCard';
import Spinner from '../Spinner';

import './MovieCardsList.css';

class MovieCardsList extends React.Component {
  //Рендер карточек фильмов

  renderItems = arr => {
    return arr.map(movie => {
      return (
        <MovieCard
          key={movie.id}
          {...movie}
          rate={this.props.rate}
          sessionId={this.props.sessionId}
          addRating={this.props.swapiService.addRating}
          changeRate={this.props.changeRate}
        />
      );
    });
  };

  render() {
    const { moviesList, totalPages, pageMovie, loading, error, errorMessage, changePage } = this.props;
    const results = moviesList && !(error || loading);
    const noResults = results && moviesList.length === 0;

    const spinner = loading ? <Spinner /> : null;
    const content = results && moviesList.length > 0 ? this.renderItems(moviesList) : null;
    const noContent = noResults ? <span className="no-results">По вашему запросу ничего не найдено</span> : null;
    const err = error ? (
      <Alert className="error" message={errorMessage.name} description={errorMessage.message} type="error" showIcon />
    ) : null;

    const pagination =
      totalPages > 1 && !(error || loading) ? (
        <Pagination defaultCurrent={pageMovie} total={totalPages} onChange={changePage} defaultPageSize={1} />
      ) : null;

    return (
      <React.Fragment>
        <ul className={error || loading || noResults ? 'card-list card-list-loading' : 'card-list'}>
          {spinner}
          {noContent}
          {content}
          {err}
        </ul>
        {pagination}
      </React.Fragment>
    );
  }
}

MovieCardsList.defaultProps = {
  moviesList: {},
  totalPages: 0,
  pageMovie: 1,
  loading: false,
  error: false,
  errorMessage: '',
};

MovieCardsList.propTypes = {
  moviesList: PropTypes.array,
  totalPages: PropTypes.number,
  pageMovie: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  changePage: PropTypes.func.isRequired,
};

export default MovieCardsList;
