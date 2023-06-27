/* eslint-disable indent */
import React from 'react';
import PropTypes from 'prop-types';
import { Rate } from 'antd';
import format from 'date-fns/format';

import { MoviesGenresConsumer } from '../MoviesGenres/MoviesGenres';

import icon from './no-image.png';
import './MovieCard.css';

class MovieCard extends React.Component {
  changeRating = value => {
    this.props
      .addRating(value, this.props.sessionId, this.props.id)
      .then(value => this.props.changeRate(value))
      .catch(this.onError);
  };

  truncate(str) {
    const { title } = this.props;

    if (str.length > 35) {
      let newStr;
      let space;

      if (title.length >= 35) {
        newStr = str.substr(0, 30);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (25 <= title.length && title.length < 35) {
        newStr = str.substr(0, 70);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (15 <= title.length && title.length < 25) {
        newStr = str.substr(0, 95);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (title.length <= 15) {
        newStr = str.substr(0, 120);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      }
    }
    return str;
  }

  render() {
    const { id, rate, title, releaseDate, overview, posterPath, voteAverage, genreIds } = this.props;
    const genreId = [...genreIds];
    const movieRate = rate && id in rate ? rate[id] : 0;

    const newRate = <Rate allowHalf count={10} defaultValue={movieRate} onChange={this.changeRating} />;

    return (
      <MoviesGenresConsumer>
        {genres => {
          const genresArr = genres.map(({ id, name }) => {
            return { [id]: name };
          });

          const movieGenres = genreId.map(ids => {
            let arrGen;

            genresArr.forEach(obj => {
              if (obj[ids]) arrGen = obj[ids];
            });

            return (
              <p key={ids} className="card-genre">
                {arrGen}
              </p>
            );
          });

          return (
            <li className="card">
              <div className="card__info">
                <div className="card__wrapper">
                  <img
                    className="card__img"
                    src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : icon}
                    alt={`Постер фильма ${title}`}
                  />
                  <div className="card__info-title">
                    <div className="card__info-inner">
                      <h2 className="card__info-name">{title}</h2>
                      <div
                        className={`card__info-rate ${
                          0 <= voteAverage && voteAverage < 3
                            ? 'bad'
                            : 3 <= voteAverage && voteAverage < 5
                            ? 'normal'
                            : 5 <= voteAverage && voteAverage < 7
                            ? 'good'
                            : 'wonderful'
                        }`}
                      >
                        {voteAverage}
                      </div>
                    </div>
                    <p className="card__info-date">
                      {releaseDate ? format(new Date(releaseDate), 'MMMM d, yyyy') : null}
                    </p>
                    <div className="card__info-genres">{movieGenres}</div>
                  </div>
                </div>

                <p className="card__info-description">{this.truncate(overview)}</p>
              </div>
              <div className="card__info-stars">{newRate}</div>
            </li>
          );
        }}
      </MoviesGenresConsumer>
    );
  }
}

MovieCard.defaultProps = {
  data: {},
  rate: {},
};

MovieCard.propTypes = {
  id: PropTypes.number,
  title: PropTypes.string,
  releaseDate: PropTypes.string,
  overview: PropTypes.string,
  posterPath: PropTypes.string,
  voteAverage: PropTypes.string,
  genreIds: PropTypes.array,

  rate: PropTypes.object,
  sessionId: PropTypes.string,
  addRating: PropTypes.func.isRequired,
  changeRate: PropTypes.func.isRequired,
};

export default MovieCard;
