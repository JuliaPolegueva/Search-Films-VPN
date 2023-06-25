/* eslint-disable indent */
import React from 'react';
import { Rate } from 'antd';
import format from 'date-fns/format';

import { MoviesGenresConsumer } from '../MoviesGenres/MoviesGenres';

import icon from './no-image.png';
import './MovieCard.css';

class MovieCard extends React.Component {
  //Добавление рейтинга

  changeRating = value => {
    this.props
      .addRating(value, this.props.sessionId, this.props.id)
      .then(value => this.props.changeRate(value))
      .catch(this.onError);
  };

  truncate(str) {
    if (str.length > 45) {
      let newStr;
      let space;

      if (this.props.title.length >= 35) {
        newStr = str.substr(0, 35);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (25 <= this.props.title.length && this.props.title.length < 35) {
        newStr = str.substr(0, 50);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (15 <= this.props.title.length && this.props.title.length < 25) {
        newStr = str.substr(0, 90);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (this.props.title.length <= 15) {
        newStr = str.substr(0, 130);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      }
    }
    return str;
  }

  //Обрезка текста описания

  /*truncate(str) {
    if (str.length > 50) {
      let newStr;
      let space;

      if (this.props.title.length >= 45) {
        newStr = str.substr(0, 50);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (32 <= this.props.title.length && this.props.title.length < 45) {
        newStr = str.substr(0, 85);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (22 <= this.props.title.length && this.props.title.length < 32) {
        newStr = str.substr(0, 110);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (12 < this.props.title.length && this.props.title.length < 22) {
        newStr = str.substr(0, 135);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      } else if (this.props.title.length <= 12) {
        newStr = str.substr(0, 145);
        space = newStr.lastIndexOf(' ');

        return newStr.slice(0, space) + '...';
      }
    }
    return str;
  }
*/
  render() {
    const { id, rate, title, releaseDate, overview, posterPath, voteAverage, genreIds } = this.props;
    const genreId = [...genreIds];
    let movieRate;

    if (rate) movieRate = id in rate ? rate[id] : 0;

    const newRate = <Rate allowHalf count={10} onChange={this.changeRating} />;
    const oldRate = <Rate allowHalf count={10} defaultValue={movieRate} />;

    const rating = movieRate ? oldRate : newRate;
    //const titleLength = title.length;

    //const overviewNew = overview.length > 50 ? `${overview + '...'}` : overview;

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
              <div className="card__info-stars">{rating}</div>
            </li>
          );
        }}
      </MoviesGenresConsumer>
    );
  }
}

export default MovieCard;

/*className={`card__info-description ${
                titleLength <= 20
                  ? 'xl'
                  : titleLength > 20 && titleLength <= 30
                  ? 'l'
                  : titleLength > 30 && titleLength <= 40
                  ? 'm'
                  : titleLength > 40 && titleLength <= 50
                  ? 's'
                  : 'xs'
              }`*/
/*{`card__info-genres ${
                0 <= genreIds && genreIds < 3
                  ? 'bad'
                  : 3 <= genreIds && genreIds < 5
                  ? 'normal'
                  : 5 <= genreIds && genreIds < 7
                  ? 'good'
                  : 'wonderful'
              }`}*/
