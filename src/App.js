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

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;
console.log(url);

function isSearched(searchTerm) {
  return item =>
    !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null,
      searchTerm: DEFAULT_QUERY
    };

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
  }
  // update with top stories fetched
  setTopStories(result) {
    this.setState({ result: result });
  }

  // fetch data from the api
  fetchTopStories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`)
      .then(response => response.json())
      .then(result => this.setTopStories(result))
      .catch(e => e);
  }
  // componen did mount
  componentDidMount() {
    this.fetchTopStories(this.state.searchTerm);
  }

  removeItem(id) {
    let isNotID = item => item.objectID !== id;
    const updatedHits = this.state.result.hits.filter(isNotID);
    // Object assignment to modified the hits in result
    // this.setState({ result: Object.assign({}, this.state.result, {hits: updatedHits}) });
    // Spread Operator ES6
    this.setState({ result: {... this.state.result, hits: updatedHits} });
  }

  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { result, searchTerm } = this.state;
    if (!result){
        return null;
    }
    return (
      <div>
        <Grid fluid>
          <Row>
            <div className="jumbotron text-center">
              <Search onChange={this.searchValue} value={searchTerm}>
                News App
              </Search>
            </div>
          </Row>
        </Grid>

        <Table
          data={result.hits}
          searchTerm={searchTerm}
          removeItem={this.removeItem}
        />
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
      <form>
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
              <button className="btn btn-primary searchBtn" type="submit">
                Search
              </button>
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
        {data.filter(isSearched(searchTerm)).map(item => (
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
