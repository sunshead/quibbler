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
                            <li>{Auth.getEmail()}</li>
                            <li><Link to="/logout">Log out</Link></li>
                        </div>)
                        :
                        (<div>
                            <li><Link to="/login">Log in</Link></li>
                            <li><Link to="/signup">Sign up</Link></li>
                        </div>)
                    }
                </ul>
            </div>
        </nav>
        <nav className="blue-grey lighten-4">
            <div className="nav-wrapper">
                <form>
                    <div className="input-field">
                        <input id="search" type="search"/>
                        <label className="label-icon" for="search"><i className="material-icons">search</i></label>
                        <i class="material-icons">close</i>
                    </div>
                </form>
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