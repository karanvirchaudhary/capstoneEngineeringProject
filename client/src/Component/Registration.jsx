import React, {useState,useEffect} from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Switch, Route,Link} from 'react-router-dom';

function Registration(props){ 
    //Create hooks for all field entries 
    const[password,setPassword] = useState("");
    const[firstName,setfirstName] = useState("");
    const[lastName,setLastName] = useState("");
    const[email,setEmail] = useState("");
    const[confirmEmail,setConfirmEmail] = useState("");
    const[phoneNum,setPhoneNum] = useState("");
    const[confirmPassword,setConfirmPassword] = useState(""); 
    const[provinceTerr, setProvTerr] = useState("");
    const[region, setRegion] = useState("");

    //Hooks for updating the display 
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);

    //Functions for updating the fields as they are typed. 
    const handlePasswordChange = e =>{
        setPassword(e.target.value);
    }
    const handleConfirmPasswordChange = e =>{
        setConfirmPassword(e.target.value);
    }
    const handleEmailChange = e =>{
        setEmail(e.target.value);
    }
    const handleConfirmEmailChange = e =>{
        setConfirmEmail(e.target.value);
    }
    const handleFirstName=e=>{
        setfirstName(e.target.value);
    }
    const handleLastName=e=>{
        setLastName(e.target.value);
    }
    const handlePhoneNum=e=>{
        setPhoneNum(e.target.value);
    } 
    const handleProvinceChange=e=>{
        setProvTerr(e.target.value);
        console.log(e.target.value);
    }
    const handleRegionChange=e=>{
        setRegion(e.target.value);
        console.log(e.target.value);
    }
    let selectedProvince = [];
    const ON = ["Peel", "Ottawa", "Toronto"];
    const AB = ["Edmonton", "Calgary"];

    if(provinceTerr ==="ON"){
        selectedProvince = ON;
    } else if(provinceTerr === "AB"){
        selectedProvince = AB;
    }

    const regionResults = selectedProvince.map((item)=>{
        return (
            <option key={item} value={item}>{item}</option>
        )
    })
   
    /*
    handleSubmit handles the form submit when the user clicks register. The form data must contain no errors.
    If the form contains no errors, then we can send a POST request to the backend to store the data into a database. 
    */
    const handleSubmit=e=>{
        e.preventDefault();
        let submission = {userFirstname:"", userLastname:"", userEmail: "", userPassword:"", userPhonenumber:"", userProvince:"", userRegion:""};
        //Check if there any empty values 
        
        if(firstName === "" || lastName === "" || emailValid === false || passwordValid === false || phoneNum === ""||region === "" || provinceTerr ===""){
            alert("Please re-enter the form. It was not completed successfuly.");
        }
        
        else{ //Now we want to post the data to the backend. 
            //console.log("Valid form");
            submission = JSON.stringify({userFirstname: firstName, userLastname:lastName, userEmail: email, userPassword:password, userPhonenumber: phoneNum, userProvince:provinceTerr, userRegion:region, startActuatorTime:"12:00:00", stopActuatorTime:"12:00:01"});
            //console.log(submission);
        }
        /*
        //And then we would post the data to the backend
        axios
        .post('/testCreateUser', {submission})
        .then( ()=>console.log("Sending to the backend the new user's info:"+ submission))
        
        .catch(err => {
            console.error(err);
        });
        */        
    } 
    
    //Sets the result of the email validation check. (Whether the email and confirm email fields match one another)
    useEffect(()=>{
        //Checks whether the email matches the confirmed email. 
        function emailCheck(){
            
            if(email === confirmEmail){
                return true;
            } else{
                return false;
            }
        }
        const emailStatus = emailCheck();
        setEmailValid(emailStatus);
    },[confirmEmail, email])

    function testPasswordStrength(){
        let errors = [];//An error to hold all the error messages 
        if(password !== "" || confirmPassword !== ""){
            if(password !== confirmPassword){
                errors.push("Passwords do not match");
             }
            if(password.length <=8){
                errors.push("Password must contain 8-12 characters");
             }
     
             var lowerCase = /[a-z]/;
             var upperCase = /[A-Z]/;
             var nums = /[0-9]/;
             var specialChar = /[!@#$%^&*]/;
     
     
             if(!password.match(lowerCase)){
                 errors.push("Password does not contain any lowercase characters");
             }
     
             if(!password.match(upperCase)){
                 errors.push("Password does not contain any uppercase characters");
             }
     
             if(!password.match(nums)){
                 errors.push("Password does not contain any numbers")
             }
     
             if(!password.match(specialChar)){
                 errors.push("Password does not contain any special characters !@#$%^&*");
             }
        }
       console.log(errors);
       return errors;
    }
    
    const passwordStatus = testPasswordStrength();
    const passwordErrors = passwordStatus.map((item)=>{
        return (
            <li>
                {item}
            </li>
        )
    })
    useEffect(()=>{
        if(passwordStatus.length === 0){
            setPasswordValid(true);
        }else{
            setPasswordValid(false);
        }
    },[passwordStatus.length])
/*
    <option value ="Ottawa">Ottawa</option>
                                <option value="Toronto">Toronto</option>
                                <option value="Peel">Peel</option>
*/
    return(
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6 registrationPic">
                </div>
                <div className="col-lg-6 registration">
                    <h2 className="heading">Sign Up</h2>
                    <form action="/testCreateUser" method="POST">
                        <div className="form-group">
                            <input type="text" className="form-control" id="fname" name="firstname" placeholder="First Name" onChange={handleFirstName}/>
                        </div>
                        <div className="form-group">
                            <input type="text" className="form-control" id="lname" name="lastname" placeholder="Last Name" onChange={handleLastName}/>
                        </div>
            
                        <div className="form-group">
                            <input type="email" className="form-control" id="inputEmail" name="email" placeholder="Email" onChange={handleEmailChange} 
                            style={emailValid? {borderBottom: "1.5px solid green"}:{borderBottom: "1.5px solid red"} }/>
                            
                        </div>

                         <div className="form-group">
                            <input type="email" className="form-control" name="confirmEmail" id="inputCEmail" placeholder="Enter your email again" onChange={handleConfirmEmailChange}
                            style={emailValid? {borderBottom: "1.5px solid green"}:{borderBottom: "1.5px solid red"} }/>
                            {emailValid? null: <p className="errorText"><i>Please make sure your e-mails match.</i></p>}

                        </div>
                        <div className="form-group">
                            <input type="tel" className="form-control"id="inputPhoneNum" name="phoneNum" 
                            placeholder="Phone number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" onChange={handlePhoneNum}/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" id="inputPassword" name="password" placeholder="Password" onChange={handlePasswordChange}
                            style={passwordValid? {borderBottom: "1.5px solid green"}:{borderBottom: "1.5px solid red"}}/>
                            {passwordValid ? null: <p className="errorText"><i>Found {passwordStatus.length} errors.</i></p>}
                            <ul className="passwordErrors">
                                {passwordErrors}
                            </ul>
                            
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" id="inputCPassword" name="confirmPassword" placeholder="Enter your password Again" onChange={handleConfirmPasswordChange}/>

                        </div>
                
                        <div className="input-group">
                            <select className="form-control" name="Province" onChange={handleProvinceChange}>
                                <option>Province or Territory</option>
                                <option value="ON">Ontario</option>
                                <option value="AB">Alberta</option>
                                <option value="BC">British Columbia</option>
                                <option value="MN">Manitoba</option>
                            </select>
            
                            <select className="form-control" name="region" onChange={handleRegionChange}>
                                <option>Region</option>
                                {regionResults}
                            </select>
                        </div>
                        <br/>
                        <button className="btn btn-primary registerButton" type="submit">Register</button>
                        <br/>
                    </form>
                </div>    
            </div>
        </div>
            
    )
}
export default Registration