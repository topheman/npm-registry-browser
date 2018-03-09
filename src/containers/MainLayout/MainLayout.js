import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const MainLayout = ({ children }) => (
  <div className="layout">
    <header>
      <h2>Some header</h2>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/foo">Foo</Link>
          </li>
          <li>
            <Link to="/bar">Bar</Link>
          </li>
        </ul>
      </nav>
    </header>
    {children}
    <footer>Some Footer</footer>
  </div>
);

MainLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default MainLayout;
