import React from 'react';
import './NavBar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav">
        <a className="navbar-brand text-white ms-4" href="#">Employee Management</a>
      </div>
    </nav>
  );
}