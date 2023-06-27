import React from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

import SwapiService from '../../services/SwapiService';

import './SearchBar.css';

class SearchBar extends React.Component {
  swapiService = new SwapiService();

  state = {
    label: '',
  };

  //Изменения label

  onLabelChange = event => {
    this.setState({
      label: event.target.value,
    });
  };

  //Отправка запроса

  componentDidUpdate = debounce((prevProps, prevState) => {
    if (this.state.label !== prevState.label) this.props.changePage(1);

    if ((this.state.label !== prevState.label && this.state.label.trim()) || this.props.page !== prevProps.page) {
      this.props.onLoading();
      this.swapiService
        .getMovies(this.state.label, this.props.page)
        .then(this.props.onMovieLoaded)
        .catch(this.props.onError);
    }
  }, 400);

  render() {
    return (
      <form className="search-form">
        <input
          className="new-query"
          placeholder="Type to search..."
          autoFocus
          onChange={this.onLabelChange}
          //Для установки связи со state
          value={this.state.label}
          required
        />
      </form>
    );
  }
}

SearchBar.defaultProps = {
  page: 1,
};

SearchBar.propTypes = {
  onError: PropTypes.func.isRequired,
  onMovieLoaded: PropTypes.func.isRequired,
  onLoading: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
  page: PropTypes.number,
};

export default SearchBar;
