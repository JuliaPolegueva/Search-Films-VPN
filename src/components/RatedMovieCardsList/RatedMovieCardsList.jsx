import React from 'react';
//import { Offline, Online } from 'react-detect-offline';
import { Pagination } from 'antd';

import MovieCard from '../MovieCard/MovieCard';
import SwapiService from '../../services/SwapiService';
import Spinner from '../Spinner/Spinner';

import './RatedMovieCardsList.css';

class RatedMovieCardsList extends React.Component {
  swapiService = new SwapiService();

  componentDidUpdate = prevProps => {
    if (this.props.pageMovieRated !== prevProps.pageMovieRated) {
      console.log('componentDidUpdate');
      this.swapiService
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
          addRating={this.swapiService.addRating}
        />
      );
    });
  }

  render() {
    const { moviesListRated, totalPagesRated, pageMovieRated, loading, error, changePage } = this.props;

    const results = moviesListRated && !(error || loading);
    const noResults = results && moviesListRated.length === 0;

    const spinner = loading ? <Spinner /> : null;
    const content = results && moviesListRated.length > 0 ? this.renderItems(moviesListRated) : null;
    const noContent = noResults ? <span className="no-results">По вашему запросу ничего не найдено</span> : null;

    const pagination =
      totalPagesRated > 1 && !(error || loading) ? (
        <Pagination defaultCurrent={pageMovieRated} total={totalPagesRated} onChange={changePage} defaultPageSize={1} />
      ) : null;

    return (
      <React.Fragment>
        <ul
          className={loading || noResults ? 'card-list card-list-rate card-list-loading' : 'card-list card-list-rate'}
        >
          {spinner}
          {noContent}
          {content}
        </ul>
        {pagination}
      </React.Fragment>
    );
  }
}

export default RatedMovieCardsList;
