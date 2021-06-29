import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

function Navbar(props){
    const [userName, setUserName] = useState("");
    const [userData, setUserData] = useState(null);

    return(
        <div className="container-fluid">
            <div className="sidenav">
                <div className="profile">
                    <img className="profilePic" src="/defaultPic.jpg"/>
                    <h6>John Smith</h6>
                    <p>User ID: {props.user}</p>
                </div>

                <br/>
                <br/>
                
                <p><Link to='/home'>Dashboard</Link></p>
                <p><Link to='/home'>Settings</Link></p>
                <p><Link to='/home'>Support</Link></p>
        
                <button className="signOutHome" type="submit"><Link to="/">Sign Out</Link></button>
            </div>
        </div> 
    )
}
export default Navbar