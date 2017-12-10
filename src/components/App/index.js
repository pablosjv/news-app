import React, { Component } from 'react';
import { Grid, Row } from 'react-bootstrap';

import Table from '../Table/index';
import Search from '../Search/index';
import { Button, Loading } from '../Button/index';

import {
  DEFAULT_QUERY,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  DEFAULT_PAGE,
  PARAM_PAGE,
  DEFAULT_HPP,
  PARAM_HPP
} from '../../constants';

const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${
  PARAM_PAGE
}${DEFAULT_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

// WithLoading is a Higher order component (a component wich takes a component)
// {isLoading, ...rest} == props but deconstructed
const WithLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

// function isSearched(searchTerm) {
//   return item =>
//     !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
// }

const updateTopStories = (hits, page) => prevState => {
  const { searchKey, results } = prevState;
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];
  return {
    results: { ...results, [searchKey]: { hits: updatedHits, page } },
    isLoading: false
  };
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: this.props.defaultQuery || DEFAULT_QUERY,
      isLoading: false,
      disbleSearch: this.props.disbleSearch || false
    };

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkTopStoriesSearchTerm = this.checkTopStoriesSearchTerm.bind(this);
  }

  checkTopStoriesSearchTerm(searchTerm) {
    return !this.state.results[searchTerm];
  }

  // update with top stories fetched
  setTopStories(result) {
    const { hits, page } = result;
    this.setState(updateTopStories(hits, page));
  }

  // fetch data from the api
  fetchTopStories(searchTerm, page) {
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${
        page
      }&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }
  // componen did mount
  componentDidMount() {
    this.setState({ searchKey: this.state.searchTerm });
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  // search new query in the API
  onSubmit(event) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    if (this.checkTopStoriesSearchTerm(searchTerm)) {
      this.fetchTopStories(searchTerm, DEFAULT_PAGE);
    }

    event.preventDefault();
  }

  removeItem(id) {
    let isNotID = item => item.objectID !== id;
    const { results, searchKey } = this.state;
    const { hits, page } = results[searchKey];
    const updatedHits = hits.filter(isNotID);
    // Object assignment to modified the hits in result
    // this.setState({ result: Object.assign({}, this.state.result, {hits: updatedHits}) });
    // Spread Operator ES6

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } }
    });
  }

  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const {
      results,
      searchTerm,
      searchKey,
      isLoading,
      disbleSearch
    } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
    const searchBar = !disbleSearch ? (
      <Grid fluid>
        <Row>
          <div className="jumbotron text-center">
            <Search
              onChange={this.searchValue}
              value={searchTerm}
              onSubmit={this.onSubmit}
            >
              News App
            </Search>
          </div>
        </Row>
      </Grid>
    ) : null;
    return (
      <div>
        {searchBar}

        <Grid>
          <Row>
            <Table data={list} removeItem={this.removeItem} />
            <div className="text-center alert">
              {
                <ButtonWithLoading
                  isLoading={isLoading}
                  className="btn btn-success"
                  onClick={() => this.fetchTopStories(searchTerm, page + 1)}
                >
                  Load More
                </ButtonWithLoading>
              }
            </div>
          </Row>
        </Grid>
      </div>
    );
  }
}

const ButtonWithLoading = WithLoading(Button);
export default App;
