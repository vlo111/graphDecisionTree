import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { ToastContainer, Slide as ToastSlide } from 'react-toastify';
import GraphForm from './pages/GraphForm';
import SignIn from './pages/sign/SignIn';
import SignUp from './pages/sign/SignUp';
import GraphView from './pages/GraphView';
import SignOut from './pages/sign/SignOut';
import GraphDrafts from './pages/profile/GraphDrafts';
import Utils from './helpers/Utils';
import ForgotPassword from './pages/sign/ForgotPassword';
import ResetPassword from './pages/sign/ResetPassword';
import OAuth from './pages/sign/OAuth';
import Shared from './pages/Shared';
import Index from './pages/Index';
import Account from './pages/profile/Account';
import Page404 from './pages/Page404';
import suspense from './helpers/suspense';
import Search from './pages/search';
import SearchPeople from './pages/search/people';
import SearchGraphs from './pages/search/graphs';
import ShareGraphs from './pages/search/ShareGraphs';
import Profile from './pages/account';

const GraphEmbed = React.lazy(() => import('./pages/GraphEmbed'));

class App extends Component {
  componentDidMount() {
    document.body.classList.add(`${Utils.getOS()}_${Utils.getBrowser()}`);
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Switch>
            <Route path="/drifts" exact component={GraphDrafts} />
            <Route path="/search" component={Search} />
            <Route path="/search-people" component={SearchPeople} />
            <Route path="/search-graph" component={SearchGraphs} />
            <Route path="/search-shared-graph" component={ShareGraphs} />
            <Route path="/templates" exact component={Index} />
            <Route path="/shared" exact component={Index} />

            <Route path="/graphs/view/:graphId" component={GraphView} />
            <Route path="/graphs/preview/:graphId" component={GraphView} />
            <Route path="/graphs/filter/:graphId" component={GraphView} />
            <Route path="/graphs/create" component={GraphForm} />
            <Route path="/graphs/shared" component={Shared} />
            <Route path="/graphs/update/:graphId" component={GraphForm} />
            <Route path="/graphs/author/:authorId" component={GraphForm} />

            <Route path="/graphs/embed/filter/:graphId/:token" component={suspense(GraphEmbed)} />
            <Route path="/graphs/embed/:graphId/:token" component={suspense(GraphEmbed)} />

            <Route path="/account" component={Account} />

            <Route path="/profile/:userId" exact component={Profile} />

            <Route path="/sign/sign-in" component={SignIn} />
            <Route path="/sign/sign-up" component={SignUp} />
            <Route path="/sign/sign-out" component={SignOut} />
            <Route path="/sign/forgot-password" component={ForgotPassword} />
            <Route path="/sign/reset-password" component={ResetPassword} />
            <Route path="/sign/oauth/:type" component={OAuth} />

            <Route path="/404" component={Page404} />

            <Route path="/" component={Index} />
          </Switch>
        </BrowserRouter>
        <ToastContainer hideProgressBar transition={ToastSlide} autoClose={3000} pauseOnFocusLoss={false} />
      </>
    );
  }
}

export default App;
