import React, { Component } from 'react';
import { Button } from '../Button/index';
import { FormGroup } from 'react-bootstrap';

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

export default Search;
