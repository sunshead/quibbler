import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import logo from '../../public/logo.png';
import Auth from '../Auth/Auth';
import './Base.css';

const Base = ({ children }) => (
    <div>
        <nav className="nav-bar blue-grey lighten-1">
            <div className="nav-wrapper">
                <a href="/" className="navbar-left"><img className="navbar-logo" src={logo} alt="logo" /></a>
                <ul id="nav-mobile" className="right">
                    {Auth.isUserAuthenticated() ?
                        (<div>
                            <li><Link to="/saved">Saved News</Link></li>
                            <li>{Auth.getEmail()}</li>
                            <li><Link to="/logout">Log out</Link></li>
                        </div>)
                        :
                        (<div>
                            <li><Link to="/saved">Saved News</Link></li>
                            <li><Link to="/login">Log in</Link></li>
                            <li><Link to="/signup">Sign up</Link></li>
                        </div>)
                    }
                </ul>
            </div>
        </nav>
        <br/>
        {children}
    </div>
);

Base.propTypes = {
    children: PropTypes.object.isRequired
};

export default Base;