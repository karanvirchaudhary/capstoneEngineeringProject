import React, {useState} from 'react';
import {BrowserRouter as Router, Switch, Route,Link} from 'react-router-dom';
import '../App.css'

function LoginForm(props){
    const[password, setPassword] = useState("");
    const[email, setEmail] = useState("");

    const handlePasswordChange = e =>{
        setPassword(e.target.value);
    } 
    /*
    const handleSubmitClick = (e)=>{
        e.preventDefault();
        fetch('/loginTest',{
            method:'POST',
            body:{emailAddress:email, userPassword:password},
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then((response)=>{
            console.log(response);
            console.log(JSON.stringify(response));
        })
        .catch(error=>console.error(error))
    }
    */

    return(
        <div className="container-fluid Intro">
            <h2 className="heading">Login</h2>
            <form method='POST' action="/login">
                <div className="form-group text-left">
                    <input type="email" 
                    className="form-control"
                    name="email" 
                    id="email" 
                    aria-describedby="emailHelp" 
                    placeholder="Enter your email"
                    />
                </div>

                <div className="form-group text-left">
                    <input type="password" 
                        className="form-control"  
                        id="password"
                        name="password" 
                        placeholder="Password"
                        onChange={handlePasswordChange}
                        />
                </div>
                <span className="forgotPassword"><a className="forgotPassword"><u>Forgot Your Password?</u></a></span>
                <br/>
                <br/>
                <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <span className="loginLine"><div className="form-group">
                        <label className="form-check-label rememberCheckbox"><input type="checkbox"/> Remember Me</label>
                        </div></span>  
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12">
                        <span className="loginLine"><button type="submit" className="btn btn-primary login">LogIn</button></span>
                    </div>  
                </div>
                <hr/>
                <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12">
                        <span className='noAccount'><h6>Don't have an account?</h6></span>
                         <button type="submit" className="btn btn-outline-primary" ><Link to="/registration">Create An Account</Link></button>
                 </div>
                </div>
            </form>
            <img className="backdrop" alt="" src="flipped.png" width="200px" height="200px"></img>
        </div>
    )
}
export default LoginForm
