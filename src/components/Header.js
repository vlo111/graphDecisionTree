import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
// import Notification from './Notification';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AccountDropDown from './account/AccountDropDown';
import SearchGraphs from './search/SearchGraphs';
import { setActiveButton } from '../store/actions/app';

class Header extends Component {
    static propTypes = {
      setActiveButton: PropTypes.func.isRequired,
    }

    handleClick = (button) => {
      this.props.setActiveButton(button);
    }

    render() {
      return (
        <header id="header">
          <div className="logo-graphs">
            <Link to="/">
              <h3> graphs analysed </h3>
            </Link>
          </div>
          <SearchGraphs />
          <div className="start-graphs">
            <Link to="/graphs/create" onClick={() => this.handleClick('create')} style={{ marginLeft: 65 }}>
              Start a graph
            </Link>
            <Link to="/tree/create" onClick={() => this.handleClick('tree')} style={{ marginLeft: 70 }}>
              Decision tree
            </Link>
          </div>

          <div className="right-elements">
             {/*<Notification />*/}
            <div className="signOut">
              <AccountDropDown />
            </div>
          </div>
        </header>
      );
    }
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  setActiveButton,
};

const Container = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

export default withRouter(Container);
