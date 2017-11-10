import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: data
    };

    this.removeItem = this.removeItem.bind(this);
  }

  removeItem(id) {
    let isNotID = item => item.objectID !== id;
    const updatedData = this.state.data.filter(isNotID);

    this.setState({ data: updatedData });
  }

  render() {
    return (
      <div className="App">
        {this.state.data.map(item => (
          <div key={item.objectID}>
            <h1>
              {' '}
              <a href={item.url}>{item.title}</a> by {item.author}
            </h1>
            <h4>
              {item.num_comments} Comments | {item.points} points
            </h4>
            <button
              type="button"
              onClick={() => this.removeItem(item.objectID)}
            >
              Remove item
            </button>
          </div>
        ))}
      </div>
    );
  }
}

export default App;
