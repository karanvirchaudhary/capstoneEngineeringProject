import React, {useState,useEffect} from 'react';
import Actuator from './Actuator';
import Consumption from './Consumption';
import Feedback from './Feedback';
import ActuatorSettings from './ActuatorSettings';

function Home(props){
    const [displaySettingsBox, setSettingsBox] = useState(false); //Toggle for displaying the actuator settings box when clicked
    const [userID, setUserID] = useState("");

    //A callback function for the ActuatorSettings component. Whenever the actuatorSettings component will be closed, 
    //It will send back a boolean on whether to display the component or not. 
    const callBackFunction = (displayResult) =>{
        setSettingsBox(displayResult);
    }; 
    useEffect(()=>{
        setUserID(props.user);
        //console.log("Home userID is "+userID);
    },[userID])

    /*
    Now we want to calculate the total consumption and then calculate the total cost as well.This function will be passed
    from the Home Component to the Feedback child component who will use this method to calculate
    the total consumption for a data set
    */
    function calculateTotalConsumption(highUsagePointsWater){
        let totalSum = 0;
        highUsagePointsWater.forEach(data=>{            
                totalSum += parseFloat(data.value);
            })
        return totalSum.toFixed(3);
    }
    /*
        calculateTotalCost is a function that takes in the user's region (Ottawa or Peel or Vaughan) and an int such as totalConsumption and calculates the cost
        for that value. This function is set up in Home, so it can be passed down to its child components: Feedback and Consumption. 
    */
    function calculateTotalCost(region,totalConsumption){
        //The units being used are in Litres (L). Most regions charge per cubic meter(equivalent to 1000L)
        let costSum = 0;
        switch(region){
            case "Ottawa":
                //console.log(region, totalConsumption);
                if(totalConsumption < 6000){
                    return costSum = parseFloat(totalConsumption * 1.63/1000).toFixed(2);
                }
                else if(totalConsumption >6000 && totalConsumption <=25000){
                    return costSum = parseFloat(totalConsumption *3.25/1000).toFixed(2);
                }
                else if(totalConsumption > 25000 && totalConsumption <=180000){
                        return costSum = parseFloat(totalConsumption * 3.59/1000).toFixed(2);
                }
                else{ 
                    return costSum = parseFloat(totalConsumption * 4.01/1000).toFixed(2);
                }
            case "Peel":
                return costSum = parseFloat(totalConsumption * 2.952/1000).toFixed(2);
                
            case "Toronto":
                if(totalConsumption <= 5000000){
                    return costSum = parseFloat(totalConsumption*0.0041346).toFixed(2);
                }
                else{
                    return costSum = parseFloat(totalConsumption*0.0028941).toFixed(2);
                }

            default:
                break;
        }
    }

    return(
        <div className="container-fluid main">
            <Consumption user={userID}/>
            <div className="form-group row">
                <Actuator user={userID} callBack={callBackFunction} />
                <Feedback user={userID} calTotalConsumption={calculateTotalConsumption} calculateCost={calculateTotalCost}/>
            </div>
            {displaySettingsBox ? <ActuatorSettings user={userID} callBack={callBackFunction}/> : null }
        </div>           
    );
}
export default Home