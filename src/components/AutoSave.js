import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Chart from '../Chart';
import { updateGraphRequest } from '../store/actions/graphs';
import ChartUtils from '../helpers/ChartUtils';
import Utils from '../helpers/Utils';

class AutoSave extends Component {
  static propTypes = {
    updateGraphRequest: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    customFields: PropTypes.object.isRequired,
    singleGraph: PropTypes.object.isRequired,
  }

  componentDidMount() {
    Chart.event.on('render', this.handleChartRender);
    Chart.event.on('node.dragend', this.handleChartRender);
    Chart.event.on('label.dragend', this.handleChartRender);
    Chart.event.on('setNodeData', this.handleChartRender);
  }

  componentWillUnmount() {
    Chart.event.removeListener('node.dragend', this.handleChartRender);
  }

  handleChartRender = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.saveGraph, 1000);
  }

  saveGraph = async () => {
    const { match: { params: { graphId } }, singleGraph } = this.props;
    const svgElement = document.querySelector('#graph svg');
    if (!graphId || !svgElement) {
      return;
    }
    document.body.classList.add('autoSave');
    const links = Chart.getLinks();
    const labels = Chart.getLabels();
    const { nodes, files, customFields } = await ChartUtils.getNodesWithFiles(this.props.customFields);
    const { outerHTML: svg } = svgElement;
    await this.props.updateGraphRequest(graphId, {
      ...singleGraph,
      nodes,
      links,
      labels,
      files,
      svg,
      customFields,
      autoSave: true,
    });
    document.body.classList.remove('autoSave');
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  singleGraph: state.graphs.singleGraph,
  customFields: state.graphs.singleGraph.customFields || {},
});

const mapDispatchToProps = {
  updateGraphRequest,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AutoSave);

export default withRouter(Container);
