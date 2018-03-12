import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const packages = [
  "react",
  "react@16.2.0",
  "@angular/core",
  "@angular/core@5.2.8"
];

const MainLayout = ({ children }) => (
  <div className="layout">
    <header>
      <h2>Some header</h2>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {packages.map(name => (
            <li key={name}>
              <Link to={`/package/${name}`}>{name}</Link>
            </li>
          ))}
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
