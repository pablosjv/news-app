import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import {
  BrowserRouter as Router,
  Route,
  Link,
  NavLink
} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
  <Router>
    <div>
      <Navbar>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
      </Navbar>
      <Route exact to="/" component={App} />
      <Route exact to="/about" component={About} />
    </div>
  </Router>
);

const About = () => (
    <div>
        <h1>This is about page</h1>
    </div>
)

ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
