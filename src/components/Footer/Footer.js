import React from 'react';
import './Footer.css';

// -----------------------------------------------
//
// Desc: Footer for all pages in the website
//
// -----------------------------------------------

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer__left-box">
            <a href="https://www.linkedin.com/in/thomas-mcerlean-6186b3b5/">Created by Tom McErlean</a>
            </div>
            <div className="footer__right-box">
            <a href="#">See the code</a>
            </div>
        </footer>
    );
}

export default Footer;