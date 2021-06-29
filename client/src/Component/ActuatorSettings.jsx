import React, {useState, useEffect} from 'react';
import axios from 'axios';

function ActuatorSettings(props){
    const [displaySettingsBox, setSettingsDisplay] = useState(false);
    const [toggleBoolean, setBooleanToggle] = useState(false);
    const [actuatorStatus, setActuatorStatus] = useState(false);
    const [startingTime, setStartingTime] = useState("");
    const [endingTime, setEndingTime] = useState("");
    const [userID, setUserID] = useState("");

    //Function to handle the change of inputs for the settings 
    const handleStartingChange = e =>{
        setStartingTime(e.target.value);
    }
    const handleEndingChange = e =>{
        setEndingTime(e.target.value);
    }
    const handleUserChange = e =>{
        setUserID(e.target.value);
    }

    function handleClick(e){
        e.preventDefault();
        setSettingsDisplay(!displaySettingsBox);
        props.callBack(displaySettingsBox);
        //console.log("Worked for cancel button");
    }
    
    const handleInit = e =>{
        e.preventDefault();
        setBooleanToggle(!toggleBoolean);
        //console.log("AS to Home" + !toggleBoolean);

        axios
        .post('/api/now', {field5:!toggleBoolean})
        .then( ()=>console.log("passing on toggleBoolean for field5:" + toggleBoolean))
        
        .catch(err => {
            console.error(err);
        });
    };
    /*
    const handleUpdate = e=>{
        e.preventDefault();
        setUserID(props.user);
        console.log(userID);
        axios
        .post('/uploadSettings', {id:userID, startTime:startingTime, endTime:endingTime})
        .then((response)=> {console.log(response);}, (err)=>{console.log(err);});
    }
    */
    

    return(
        <div className="settingsContainer">
            <button className="btn btn-secondary cancelButton" type="submit" onClick={e=>handleClick(e)} >X</button>
            <br/>
            <h4 className="heading">Configure Actuator</h4>
            <form method='POST' action='/uploadSettings'>
                <div className="form-group">
                    <label>User ID:</label>
                    <input type="text" className="form-control" id="startTime" name="userID" onChange={handleUserChange} placeholder=""/>
                </div>
                <div className="form-group">
                    <label>Start Time:</label>
                    <input type="time" className="form-control" id="startTime" name="startTime" step="1" onChange={handleStartingChange} placeholder=""/>
                </div>
                <div className="form-group">
                    <label>End Time:</label>
                    <input type="time" className="form-control" id="endTime" name="endTime" step="1"onChange={handleEndingChange} placeholder=""/>
                </div>

                <span className="buttonLayout">
                    <button className="btn btn-primary updateButton" type="submit">Update</button>
                    <button className="btn btn-outline-primary initButton" type="submit" onClick={handleInit}> {toggleBoolean ? <span>Turnoff</span>: <span>Initialize</span>}</button>
                </span>
            </form> 
        </div> 
    )
}
export default ActuatorSettings 