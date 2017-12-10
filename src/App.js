import React, { Component } from 'react';
import logo from './logo.svg';
import data from './data.js';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
// import './App.css';
import { Grid, Row, FormGroup } from 'react-bootstrap';
import {
  DEFAULT_QUERY,
  PATH_BASE,
  PATH_SEARCH,
  PARAM_SEARCH,
  DEFAULT_PAGE,
  PARAM_PAGE,
  DEFAULT_HPP,
  PARAM_HPP
} from './constants';

// Sorting Options
const SORT = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};

// const url = PATH_BASE + PATH_SEARCH + '?' + PARAM_SEARCH + DEFAULT_QUERY;
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${
  PARAM_PAGE
}${DEFAULT_PAGE}&${PARAM_HPP}${DEFAULT_HPP}`;
console.log(url);

// WithLoading is a Higher order component (a component wich takes a component)
// {isLoading, ...rest} == props but deconstructed
const WithLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;

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
      searchTerm: DEFAULT_QUERY,
      isLoading: false,
      sortKey: 'NONE',
      isReverseSorted: false
    };

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
    this.setTopStories = this.setTopStories.bind(this);
    this.fetchTopStories = this.fetchTopStories.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.checkTopStoriesSearchTerm = this.checkTopStoriesSearchTerm.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isReverseSorted =
      this.state.sortKey === sortKey && !this.state.isReverseSorted;
      console.log('IS REVERSE SORTED', isReverseSorted);
    this.setState({ sortKey, isReverseSorted });
  }

  checkTopStoriesSearchTerm(searchTerm) {
    return !this.state.results[searchTerm];
  }

  // update with top stories fetched
  setTopStories(result) {
    const { hits, page } = result;
    // const oldHits = page === 0 ? [] : this.state.result.hits;
    const { searchKey, results } = this.state;
    const oldHits =
      results && results[searchKey] ? results[searchKey].hits : [];
    const updatedHits = [...oldHits, ...hits];

    this.setState({
      results: { ...results, [searchKey]: { hits: updatedHits, page } },
      isLoading: false
    });
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
    const { results, searchTerm, searchKey, isLoading } = this.state;
    const page =
      (results && results[searchKey] && results[searchKey].page) || 0;
    const list =
      (results && results[searchKey] && results[searchKey].hits) || [];
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

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  className: ''
};
// CLASS VERSION OF THE COMPONETS
class Search extends Component {
  // constructor() {}
  componentDidMount() {
    this.input.focus();
  }
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
              ref={node => (this.input = node)}
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
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isReverseSorted: false
    };
    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isReverseSorted =
      this.state.sortKey === sortKey && !this.state.isReverseSorted;
    console.log('IS REVERSE SORTED', isReverseSorted);
    this.setState({ sortKey, isReverseSorted });
  }

  render() {
    const { data, removeItem } = this.props;
    const { searchTerm, sortKey, isReverseSorted } = this.state;
    // const sortType = [];
    // for (var key in SORT) {
    //   // skip loop if the property is from prototype
    //   if (!SORT.hasOwnProperty(key)) continue;
    //   sortType.push(
    //     <Sort sortKey={key} onSort={onSort}>
    //       {key}
    //     </Sort>
    //   );
    // }
    const sortedList = isReverseSorted
      ? SORT[sortKey](data).reverse()
      : SORT[sortKey](data);
    return (
      <div className="col-sm-10 col-sm-offset-1">
        {/* data.filter(isSearched(searchTerm)) */}
        <hr />
        <div className="text-center">
          {/* {sortType} */}
          <Sort
            className="btn btn-xs btn-default sortBtn"
            sortKey={'NONE'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Default
          </Sort>

          <Sort
            className="btn btn-xs btn-default sortBtn"
            sortKey={'TITLE'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Title
          </Sort>

          <Sort
            className="btn btn-xs btn-default sortBtn"
            sortKey={'AUTHOR'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Author
          </Sort>

          <Sort
            className="btn btn-xs btn-default sortBtn"
            sortKey={'COMMENTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Comments
          </Sort>

          <Sort
            className="btn btn-xs btn-default sortBtn"
            sortKey={'POINTS'}
            onSort={this.onSort}
            activeSortKey={sortKey}
          >
            Points
          </Sort>
        </div>
        <hr />

        {sortedList.map(item => (
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

Table.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  removeItem: PropTypes.func.isRequired
};

const Sort = ({ sortKey, onSort, children, className, activeSortKey }) => {
  const sortClass = ['btn default'];

  if (sortKey === activeSortKey) {
    sortClass.push('btn btn-primary');
  }
  return (
    <Button className={sortClass.join(' ')} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

const Loading = () => (
  <div>
    <h2>Loading...</h2>
  </div>
);
const ButtonWithLoading = WithLoading(Button);

export default App;
