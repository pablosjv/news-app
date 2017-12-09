import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Grid, Row } from 'react-bootstrap';

const data = [
  {
    title: 'Tell me something',
    url: 'http://kaloraat.com',
    author: 'Pablo',
    num_comments: 100,
    points: 50,
    objectID: 1
  },
  {
    title: 'Oh my lord my lord',
    url: 'http://kaloraat.com',
    author: 'Ryan',
    num_comments: 50,
    points: 20,
    objectID: 2
  },
  {
    title: 'Black eyes of the silver snake',
    url: 'http://kaloraat.com',
    author: 'Ninja',
    num_comments: 300,
    points: 1000,
    objectID: 3
  }
];

function isSearched(searchTerm) {
  return item =>
    !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data,
      searchTerm: ''
    };

    this.removeItem = this.removeItem.bind(this);
    this.searchValue = this.searchValue.bind(this);
  }

  removeItem(id) {
    let isNotID = item => item.objectID !== id;
    const updatedData = this.state.data.filter(isNotID);

    this.setState({ data: updatedData });
  }

  searchValue(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { data, searchTerm } = this.state;

    return (
      <div className="App">
        <Grid>
          <Row>
            <div className="jumbotron">
              <Search onChange={this.searchValue} value={searchTerm}>
                Search here
              </Search>
            </div>
          </Row>
        </Grid>

        <Table
          data={data}
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

const Button = ({ type, onClick, children }) => (
  <button type={type} onClick={onClick}>
    {children}
  </button>
);

// CLASS VERSION OF THE COMPONETS
class Search extends Component {
  // constructor() {}
  render() {
    return (
      <form>
        {this.props.children}
        <input
          type="text"
          onChange={this.props.onChange}
          value={this.props.value}
        />
      </form>
    );
  }
}
class Table extends Component {
  render() {
    const {data, searchTerm, removeItem} = this.props;
    return (
      <div>
        {data.filter(isSearched(searchTerm)).map(item => (
          <div key={item.objectID}>
            <h1>
              {' '}
              <a href={item.url}>{item.title}</a> by {item.author}
            </h1>
            <h4>
              {item.num_comments} Comments | {item.points} points
            </h4>
            <Button type="button" onClick={() => removeItem(item.objectID)}>
              Remove
            </Button>
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
