import React, { Component } from 'react';
import Modal from 'react-modal';
import _ from 'lodash';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { toast } from 'react-toastify';
import Input from './form/Input';
import Button from './form/Button';
import { createTreeRequest, createGraphRequest } from '../store/actions/graphs';

class CreateGraphModal extends Component {
  static propTypes = {
    createGraphRequest: PropTypes.func.isRequired,
    createTreeRequest: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    singleGraph: PropTypes.object.isRequired,
    singleTree: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    activeButton: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      requestData: {
        title: '',
        description: '',
      },
    };
  }

  handleChange = (path, value) => {
    const { requestData } = this.state;
    _.set(requestData, path, value);
    this.setState({ requestData });
  }

  addGraph = async () => {
    const { requestData } = this.state;

    const isTree = this.props.activeButton === 'tree';

    const { payload: { data } } = !isTree
      ? await this.props.createGraphRequest({
        ...requestData,
        status: 'active',
      })
      : await this.props.createTreeRequest({
        ...requestData,
        status: 'active',
      });

    const id = data?.graphId ?? data?.treeId;

    if (id) {
      this.props.history.replace(isTree ? `/tree/update/${id}` : `/graphs/update/${id}`);
      return;
    }
    toast.error('Something went wrong');
  }

  render() {
    const {
      activeButton, singleGraph, singleTree, match: { params: { graphId = '', treeId = '' } },
    } = this.props;
    const { requestData } = this.state;
    if (activeButton === 'create') {
      if (graphId || !_.isEmpty(singleGraph)) {
        return null;
      }
    } else if (activeButton === 'tree') {
      if (treeId || !_.isEmpty(singleTree)) {
        return null;
      }
    }
    return (
      <Modal
        className="ghModal ghModalSave"
        overlayClassName="ghModalOverlay"
        isOpen
      >
        <h2>
          {activeButton !== 'tree' ? 'Create Graph' : 'Create decision tree'}
        </h2>
        <Input
          label="Title"
          value={requestData.title}
          onChangeText={(v) => this.handleChange('title', v)}
        />
        <Input
          label="Description"
          value={requestData.description}
          textArea
          onChangeText={(v) => this.handleChange('description', v)}
        />
        <div className="buttons">
          <Button onClick={this.props.history.goBack}>
            Cancel
          </Button>
          <Button
            className="saveNode"
            disabled={!requestData.title}
            onClick={this.addGraph}
          >
            Create
          </Button>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  singleGraph: state.graphs.singleGraph,
  singleTree: state.graphs.singleTree,
  activeButton: state.app.activeButton,
});

const mapDispatchToProps = {
  createGraphRequest,
  createTreeRequest,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateGraphModal);

export default withRouter(Container);
