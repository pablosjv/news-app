import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';

import {Button, Sort} from '../Button/index'

// Sorting Options
const SORT = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse()
};
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
    const { sortKey, isReverseSorted } = this.state;
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

export default Table;
