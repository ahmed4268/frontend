

import { Outlet } from 'react-router-dom';
import { Fragment } from 'react';
import { Footer } from 'flowbite-react';
import React from "react";

const Footerr = ()=> {
    return (
        <Fragment>

        <div>
        <Footer container className="footer">

            <Footer.Copyright href="#" by="OptiTrack™" year={2024} />
            <Footer.LinkGroup>
                <Footer.Link href="#">About</Footer.Link>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Licensing</Footer.Link>
                <Footer.Link href="#">Contact</Footer.Link>
            </Footer.LinkGroup>
        </Footer>
        </div>
        </Fragment>
    );
}
export default Footerr;
