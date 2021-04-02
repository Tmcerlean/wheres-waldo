import React from 'react';
import Header from '../Header/Header';

// -----------------------------------------------
//
// Desc: Reusable Layout for all pages
//
// -----------------------------------------------

const Layout = (props) => {

    return (
        <>
            <Header />
                <main>{props.children}</main>
        </>
    );
};

export default Layout;