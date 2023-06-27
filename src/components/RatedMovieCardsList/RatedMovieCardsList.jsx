import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, Alert } from 'antd';

import MovieCard from '../MovieCard/MovieCard';
import Spinner from '../Spinner/Spinner';

import './RatedMovieCardsList.css';

class RatedMovieCardsList extends React.Component {
  componentDidUpdate = prevProps => {
    if (this.props.pageMovieRated !== prevProps.pageMovieRated) {
      this.props.onLoading();
      this.props.swapiService
        .getRatedMovies(this.props.sessionId, this.props.pageMovieRated)
        .then(this.props.onRatedMovieLoaded)
        .catch(this.props.onError);
    }
  };

  renderItems(arr) {
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
  }

  render() {
    const { moviesListRated, totalPagesRated, pageMovieRated, loading, error, errorMessage, changePage } = this.props;

    const results = moviesListRated && !(error || loading);
    const noResults = results && moviesListRated.length === 0;

    const spinner = loading ? <Spinner /> : null;
    const content = results && moviesListRated.length > 0 ? this.renderItems(moviesListRated) : null;
    const noContent = noResults ? <span className="no-results">По вашему запросу ничего не найдено</span> : null;
    const err = error ? (
      <Alert className="error" message={errorMessage.name} description={errorMessage.message} type="error" showIcon />
    ) : null;

    const pagination =
      totalPagesRated > 1 && !(error || loading) ? (
        <Pagination defaultCurrent={pageMovieRated} total={totalPagesRated} onChange={changePage} defaultPageSize={1} />
      ) : null;

    return (
      <React.Fragment>
        <ul
          className={
            error || loading || noResults ? 'card-list card-list-rate card-list-loading' : 'card-list card-list-rate'
          }
        >
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

RatedMovieCardsList.defaultProps = {
  moviesListRated: {},
  totalPagesRated: 0,
  pageMovieRated: 1,
  loading: false,
  error: false,
  errorMessage: '',
};

RatedMovieCardsList.propTypes = {
  moviesListRated: PropTypes.array,
  totalPagesRated: PropTypes.number,
  pageMovieRated: PropTypes.number,
  loading: PropTypes.bool,
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  changePage: PropTypes.func.isRequired,
};

export default RatedMovieCardsList;
