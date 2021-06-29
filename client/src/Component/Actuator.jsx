import React, {useState, useEffect} from 'react';

function Actuator(props){
    //Want the settingsBox to be hidden at first
    const [displaySettingsBox, setSettingsDisplay] = useState(false);
    const [actuatorStatus, setActuatorStatus] = useState(false);

    useEffect(()=>{
        setActuatorStatus(props.status);
    },[props.status]);

    //Need state for the status update

    function handleClick(e){
        e.preventDefault();
        setSettingsDisplay(!displaySettingsBox);
        props.callBack(displaySettingsBox);
    }

    return(
        <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="actuator">
                    <h4 className="mainHeadings">Actuator Device</h4>
                    <div className="row">
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <p><b>Status:</b> Offline</p>
                            <button className="btn btn-primary-outline configButton" onClick={e=>handleClick(e)}>Configure Actuator</button>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-6">
                            <div className="progress" id="completion"></div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export default Actuator