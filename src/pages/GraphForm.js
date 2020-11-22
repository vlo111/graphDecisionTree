import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import memoizeOne from 'memoize-one';
import Wrapper from '../components/Wrapper';
import ToolBar from '../components/ToolBar';
import ReactChart from '../components/chart/ReactChart';
import AddNodeModal from '../components/chart/AddNodeModal';
import Crop from '../components/chart/Crop';
import ContextMenu from '../components/contextMenu/ContextMenu';
import DataView from '../components/dataView/DataView';
import DataImport from '../components/import/DataImportModal';
import NodeDescription from '../components/NodeDescription';
import { setActiveButton } from '../store/actions/app';
import {
  clearSingleGraph, clearSingleTree, getSingleTreeRequest, getSingleGraphRequest,
} from '../store/actions/graphs';
import AddLinkModal from '../components/chart/AddLinkModal';
import Zoom from '../components/Zoom';
import SearchModal from '../components/search/SearchModal';
import AutoPlay from '../components/AutoPlay';
import MapsGraph from '../components/maps/MapsGraph';
import NodeFullInfo from '../components/nodeInfo/NodeFullInfo';
import AddLabelModal from '../components/chart/AddLabelModal';
import LabelTooltip from '../components/LabelTooltip';
import ToolBarHeader from '../components/ToolBarHeader';
import CreateGraphModal from '../components/CreateGraphModal';
import { socketSetActiveGraph } from '../store/actions/socket';
import AutoSave from '../components/AutoSave';
import TreeView from '../components/tree';

class GraphForm extends Component {
  static propTypes = {
    getSingleGraphRequest: PropTypes.func.isRequired,
    getSingleTreeRequest: PropTypes.func.isRequired,
    setActiveButton: PropTypes.func.isRequired,
    clearSingleGraph: PropTypes.func.isRequired,
    clearSingleTree: PropTypes.func.isRequired,
    socketSetActiveGraph: PropTypes.func.isRequired,
    activeButton: PropTypes.string.isRequired,
    match: PropTypes.object.isRequired,
  }

  getSingleGraph = memoizeOne((graphId) => {
    this.props.setActiveButton('create');
    if (+graphId) {
      this.props.getSingleGraphRequest(graphId);
    } else {
      this.props.clearSingleGraph();
    }
    this.props.socketSetActiveGraph(+graphId || null);
  })

    getSingleTree = memoizeOne((treeId) => {
      this.props.setActiveButton('tree');
      if (+treeId) {
        this.props.getSingleTreeRequest(treeId);
      } else {
        this.props.clearSingleTree();
      }
    })

    render() {
      const { activeButton, match: { params: { graphId, treeId } } } = this.props;

      if (treeId || activeButton === 'tree') {
        this.props.setActiveButton('tree');
        this.getSingleTree(treeId);
      } else {
        this.getSingleGraph(graphId);
      }
      return (
        activeButton !== 'tree'
          ? (
            <Wrapper className="graphsPage" showHeader={false} showFooter={false}>
              <div className="graphWrapper">
                <ReactChart />
              </div>
              <ToolBarHeader />
              <ToolBar />
              <Crop />
              <AddNodeModal />
              {activeButton === 'data' && <DataView />}
              {activeButton === 'search' && <SearchModal />}
              {activeButton === 'maps-view' && <MapsGraph />}
              <AddLinkModal />
              <AddLabelModal />
              <ContextMenu />
              <DataImport />
              <NodeDescription />
              <NodeFullInfo />
              <AutoPlay />
              <Zoom />
              <LabelTooltip />
              <CreateGraphModal />
              <AutoSave />
            </Wrapper>
          )
          : (
            <Wrapper className="graphsPage" showHeader={false} showFooter={false}>
              <div className="graphWrapper">
                <TreeView />
              </div>
              <CreateGraphModal />
            </Wrapper>
          )
      );
    }
}

const mapStateToProps = (state) => ({
  activeButton: state.app.activeButton,
  singleGraphLabels: state.graphs.singleGraph.labels || [],
});
const mapDispatchToProps = {
  setActiveButton,
  getSingleGraphRequest,
  getSingleTreeRequest,
  socketSetActiveGraph,
  clearSingleGraph,
  clearSingleTree,
};
const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(GraphForm);

export default Container;
