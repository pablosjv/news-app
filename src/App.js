import React, { Component } from 'react';
import logo from './logo.svg';
import data from './data.js';
// import './App.css';
import { Grid, Row, FormGroup } from 'react-bootstrap';

//Default parameters to fetch data from the API

const DEFAULT_QUERY = 'react';
const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const DEFAULT_PAGE = 0;
const PARAM_PAGE = 'page=';

const DEFAULT_HPP = 100; // DEFAULT HITS PER PAGE
const PARAM_HPP = 'hitsPerPage=';

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${
  PARAM_PAGE}${DEFAULT_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

function isSearched(searchTerm) {
  return item =>
    !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY
    };

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  // update with top stories fetched
  setTopStories(result) {
    const { hits, page } = result;
    // const oldHits = page === 0 ? [] : this.state.result.hits;
    const {searchKey, results} = this.state;
    const oldHits = results && results[searchKey] ? results[searchKey].hits : [];

    const updatedHits = [...oldHits, ...hits];
    this.setState({ results: { ...results, [searchKey]: {hits: updatedHits, page: page } }});
  }

  // fetch data from the api
  fetchTopStories(searchTerm, page) {
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
      this.setState({searchKey: this.state.searchTerm})
    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
  }

  // search new query in the API
  onSubmit(event) {
      this.setState({searchKey: this.state.searchTerm})

    this.fetchTopStories(this.state.searchTerm, DEFAULT_PAGE);
    event.preventDefault();
  }

  removeItem(id) {
    let isNotID = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotID);
    // Object assignment to modified the hits in result
    // this.setState({ result: Object.assign({}, this.state.result, {hits: updatedHits}) });
    // Spread Operator ES6
    this.setState({ result: { ...this.state.result, hits: updatedHits } });
  }

  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { results, searchTerm, searchKey } = this.state;
    const page = (results && results[searchKey] && results[searchKey].page) || 0;
    const list = (results && results[searchKey] && results[searchKey].list) || [];
    return (
      <div>
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
        {results && (
          <Table
            data={list}
            searchTerm={searchTerm}
            removeItem={this.removeItem}
          />
        )}
        <div className="text-center alert">
          <Button
            className="btn btn-success"
            onClick={() => this.fetchTopStories(searchTerm, page + 1)}
          >
            Load More
          </Button>
        </div>
      </div>
    );
  }
}

// STATELESS COMPONENTS AS ANONYMOUS FUNCTIONS
// const Search = ({ onChange, value, children }) => {
//   <form>
//     {children}
//     <input type="text" onChange={onChange} value={value} />
//   </form>
// };
// const Table = ({ data, searchTerm, removeItem }) => {
//   <div>
//     {data.filter(isSearched(searchTerm)).map(item => (
//       <div key={item.objectID}>
//         <h1>
//           {' '}
//           <a href={item.url}>{item.title}</a> by {item.author}
//         </h1>
//         <h4>
//           {item.num_comments} Comments | {item.points} points
//         </h4>
//         <Button type="button" onClick={() => removeItem(item.objectID)}>
//           Remove
//         </Button>
//       </div>
//     ))}
//   </div>
// };

const Button = ({ type, onClick, children, className = '' }) => (
  <button className={className} type={type} onClick={onClick}>
    {children}
  </button>
);

// CLASS VERSION OF THE COMPONETS
class Search extends Component {
  // constructor() {}
  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        <FormGroup>
          <h1 style={{ fontWeight: 'bold' }}>{this.props.children}</h1>{' '}
          <hr style={{ border: '2px solid black', width: '100px' }} />
          <div className="inputGroup">
            <input
              className="form-control width100 searchForm"
              type="text"
              onChange={this.props.onChange}
              value={this.props.value}
            />
            <span className="input-group-btn">
              <Button className="btn btn-primary searchBtn" type="submit">
                Search
              </Button>
            </span>
          </div>
        </FormGroup>
      </form>
    );
  }
}
class Table extends Component {
  render() {
    const { data, searchTerm, removeItem } = this.props;
    return (
      <div className="col-sm-10 col-sm-offset-1">
        {/* data.filter(isSearched(searchTerm)) */}
        {data.map(item => (
          <div key={item.objectID}>
            <h1>
              {' '}
              <a href={item.url}>{item.title}</a>
            </h1>
            <h4>
              {item.author} | {item.num_comments} Comments | {item.points}{' '}
              points
              <Button
                className="btn btn-danger btn-xs"
                type="button"
                onClick={() => removeItem(item.objectID)}
              >
                Remove
              </Button>
            </h4>
            <hr />
          </div>
        ))}
      </div>
    );
  }
}
// class Button extends Component {
//   render() {
//     const { type, onClick, children } = this.props;
//     return (
//       <button type={type} onClick={onClick}>
//         {children}
//       </button>
//     );
//   }
// }

export default App;
