import React from 'react';
import NavBar from '../components/nav-bar/NavBar';
import Footer from '../components/footer/Footer';
import Content from '../components/content/Content';
import './Home.css';

export default function Home() {
  return (
    <div className="page-container">
      <NavBar />
      <div className="content-container">
        <Content />
      </div>
      <Footer />
    </div>
  );
}