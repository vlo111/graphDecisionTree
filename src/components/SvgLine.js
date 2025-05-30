import React, { Component } from 'react';
import ChartUtils from '../helpers/ChartUtils';

class SvgLine extends Component {
  render() {
    const { type } = this.props;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 18" height="18" width="310">
        <line
          strokeLinecap={ChartUtils.dashLinecap(type)}
          strokeDasharray={ChartUtils.dashType(type, 2)}
          stroke="#7166F8"
          strokeWidth="2"
          x1="0"
          y1="10"
          x2="310"
          y2="10"
        />
      </svg>
    );
  }
}

export default SvgLine;
