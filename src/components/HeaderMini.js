import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { renderToString } from 'react-dom/server';
import _ from 'lodash';
import { connect } from 'react-redux';
import SearchInput from './search/SearchInput';
import AccountDropDown from './account/AccountDropDown';
import Utils from '../helpers/Utils';
import Chart from '../Chart';
import { setLoading } from '../store/actions/app';
import ExportNodeTabs from './ExportNode/ExportNodeTabs';
import GraphUsersInfo from "./GraphUsersInfo";
import Button from "./form/Button";

class HeaderMini extends Component {
  async componentWillMount() {
    let {
      headerImg, node,
    } = this.props;


    const nodeData = [];

    const nodeLinks = Chart.getNodeLinks(node.id, 'all');
    const nodes = Chart.getNodes();
    const connectedNodes = nodeLinks.map(async (l) => {
      let connected;
      if (l.id === node.id) {
        connected = nodes.find((d) => d.id === l.target);
      } else {
        connected = nodes.find((d) => d.id === l.source);
      }
      connected.icon = await Utils.blobToBase64(connected.icon);

      nodeData.push({ name: connected.name, icon: connected.icon });

      this.setState({ nodeData });

      return {
        linkType: l.type,
        connected,
      };
    });

    const connectedNodesGroup = Object.values(_.groupBy(connectedNodes, 'linkType'));
    const obj = _.orderBy(connectedNodesGroup, (d) => d.length, 'desc');

    this.setState({ nodeData: obj });

    if (headerImg && !headerImg.startsWith('https://maps.googleapis.com')) {
      headerImg = await Utils.blobToBase64(headerImg);
    }
    this.setState({ image: headerImg });
  }

  toggleGraphUsersInfo = (showGraphUsersInfo) => {
    this.setState({ showGraphUsersInfo });
  }

  render() {
    const { showGraphUsersInfo } = this.state;
    const { tabs, node, match: { params: { graphId = '', token = '' } } } = this.props;
    const isInEmbed = Utils.isInEmbed();
    return (
      <header id="headerMini">
        <SearchInput />
        <ul className="navLinks">
          <li>
            <Link to={isInEmbed ? `/graphs/embed/filter/${graphId}/${token}` : `/graphs/filter/${graphId}`}>
              Filter
            </Link>
          </li>
          <li>
            <Button onClick={() => this.toggleGraphUsersInfo(true)}>
              Info
            </Button>
          </li>
          <li>
            <ExportNodeTabs
              node={node}
              tabs={tabs}
              nodeData={this.state.nodeData}
              image={this.state.image}
            />
          </li>
        </ul>
        {
          !isInEmbed ? (
            <AccountDropDown mini />
          ) : null
        }

        {showGraphUsersInfo ? (
          <GraphUsersInfo onClose={() => this.toggleGraphUsersInfo(false)} />
        ) : null}
      </header>
    );
  }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setLoading,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(HeaderMini);

export default withRouter(Container);
