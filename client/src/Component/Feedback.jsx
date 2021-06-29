import React, {useState,useEffect} from 'react';

function Feedback(props){
    //Make an API Call to get the data from the thingspeak Channel
    const [dataSet, setDataSet] = useState([]);
    const [averageConsumption, setAvgConsumption] = useState(0);
    const [overuseCost, setOveruseCost] = useState(0);
    const [sufficentNumReadings, setSufficientStatus] = useState(false);
    const [adviceStatus, setAdviceStatus] = useState(false);
    
    useEffect(()=>{
        fetch("https://api.thingspeak.com/channels/1160881/feeds.json?api_key=473GSMPC4BD4R44T&days=1")
        .then((res)=>res.json())
        .then((data) => setDataSet(data.feeds))
    },[])
    //console.log(dataSet);

    //First we want to calculate the peak and the through of the data set. 
    const workingData = dataSet.filter(data =>data.field3 !== "" && data.field3 !==null); //Removing any entries that do not have a measurement associated with them.
    //Now we want to take all the measurement values from the workingSet, calculate the max. and min. values 
    const measurements = []; //This array will holds objects in the form: measurements[0] = {id: entry_id from the workingData, value: the litres used} 
    //This way measurements can be used to hold only valuable data entries that can be used for our analysis 

    const calculationPurposes = []; //This array is used to store all the values from the workingData set, and then calculate the max and min values. 
    for(let i =0;i<workingData.length;i++){
        calculationPurposes[i] = parseFloat(workingData[i].field3);
        measurements[i] = {entryID:workingData[i].entry_id, value:workingData[i].field3, timestamp: workingData[i].created_at};
    }
    const max = Math.max(...calculationPurposes);
    const min = Math.min(...calculationPurposes);
    //Now we want to calculate the range from the min. value to the max.value 
    let range = max-min;
    //console.log(max,min);
    //console.log(measurements.length);   
    
    useEffect(()=>{
        /* To handle the scenario in which the user has recently set up the system and has no readings, or there are not enough workable recordings/measurements 
        to conduct a thorough analysis, the user will be informed of this situtation. As more readings are collected, the more accurate and thorough the analysis can be:
        */ 
        //Since the GET request for the ThingSpeak API is set to get the data from the past 720 minutes (12 hrs)
        //We believe having 40 readings is sufficent for there to be a plethora of data to create a diverse dataset, which can be analyzed
        function determineSufficientReadings(){
            if(measurements.length >40){
                return true;
            } else{
                return false;
            }
        }    
        const sufficiencyResult = determineSufficientReadings();
        setSufficientStatus(sufficiencyResult);
    },[measurements.length])



    //This helper function is used to determine which values in the dataSet identify as high usage values
    //Any value that is in a 20% range of the peak value is considered a high usage value
    
    function calculateHighUsageValues(max){
        const threshold = max *0.80; //If a value is greater than the threshold, it is considered as a high usage value
        //console.log(threshold);
        let highUsageVals = [];
        let count = 0; 
        for(let i =0; i<measurements.length;i++){
            if(measurements[i].value >= threshold){
                highUsageVals[count] = measurements[i].value;
                count +=1;
            }
        }
        /*
        highUsageVals will contain data values that are within a 20% range of the peak value 
        When there are more records, it is probable that there will be more than 10 items in the highUsageVals Array, 
        since this array will be displayed, we cannot bombard the user with a list of 10+ items. So, we will only display the top 5 highest usage values 
        as this will provide a brief overview. 
        */
        highUsageVals.sort((a,b)=>b-a)
       //Now that we have sorted the highUsageVals, we will then cross-reference with the measurement's array, so that we can assign the values in the 
       //highUsageVals array with their respective entryID and timestamp
       let counter = 0;//A counter for this 
       for(let i=0;i<measurements.length;i++){
           if(highUsageVals[counter] === measurements[i].value){
               highUsageVals[counter] = measurements[i];
               //console.log(highUsageVals[counter]);
               counter +=1;
           }
       }
       
        //console.log(highUsageVals);
        return highUsageVals.slice(0,4); //This way only the first 5 elements are returned 
    }
    
    const highUsagePointsWater = calculateHighUsageValues(max); 

    //Need to reformat the timestamp so it is userfriendly (the current format is: 2021-03-15T01:01:14Z)
    function reformatTimestamp(highUsagePointsWater){
        let temp = highUsagePointsWater;
        temp.forEach((item)=>{
            let tempString = item.timestamp;
            //console.log(tempString);
            //Splitting up the string to get the date
            let year = tempString.slice(0,4);
            let month = parseInt(tempString.slice(5,7))-1;
            //console.log(month);
            let day = tempString.slice(8,10); 

            //Splitting up the string to get the time 
            let hour = tempString.slice(11,13);
            let minute = tempString.slice(14,16);
            let seconds = tempString.slice(17,19); 
        
            let date = new Date(year,month,day,hour,minute,seconds)
            console.log(date);
            item.timestamp = "On " + date.toDateString() + " at " + date.toTimeString().slice(0,8);
            //console.log(item.timestamp);
        });
    } 

    //Reformat the timestamps by calling the function 
    reformatTimestamp(highUsagePointsWater); 
    let totalConsumption = props.calTotalConsumption(highUsagePointsWater);
    

    useEffect(()=>{
        function determineAdviceStatus(){
            if(highUsagePointsWater.length === 0){
                return false;
            } else{return true;}
        }
        const adviceResults = determineAdviceStatus();
        setAdviceStatus(adviceResults);   
    },[highUsagePointsWater.length])

    //console.log(totalConsumption);

    //Displaying the high usage water points calculated and reformatted from above 
    const displayWaterPoints = highUsagePointsWater.map((item)=>{
        return(
            <li key={item.entryID}>
                {item.timestamp}: {item.value}L
            </li>
        )
    }) 
    
    
    useEffect(()=>{
        const totalCost = props.calculateCost("Ottawa",totalConsumption);
        //console.log(totalCost);
        setOveruseCost(totalCost);
    },[props,totalConsumption]) 
    
   useEffect(()=>{
        function calculateAverage(){
            let sum = 0;
            for(let i =0; i<calculationPurposes.length;i++){
                sum += calculationPurposes[i];
            }
            return (sum/calculationPurposes.length).toFixed(3);
        }
       const avgConsumption = calculateAverage();
       setAvgConsumption(avgConsumption);
   },[calculationPurposes])

    return(
        <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="feedback">
                    <span className="mainHeadings"><h4>Recommendations</h4></span>
                    <p>Based on our analysis, we have come up with the following set of recommedations to help you lower your utility bills</p>
                    <h6>Points of High Consumption for Water:</h6>
                    <div>
                        <ul>
                            {displayWaterPoints}
                        </ul>
                        <p>Total Cost: ${overuseCost}</p>
                        {adviceStatus ? <p>Please monitor what activities you are doing during these time periods, so you can reduce your water consumption and save money</p>: null }
                    </div>
                    
                    <h6>Statistics:</h6>
                    <ul>
                        <li>Highest Consumption: {max}L</li>
                        <li>Average Consumption: {(averageConsumption)}L </li>
                    </ul>
                    {sufficentNumReadings ? null :<p>The current number of readings by the system is not sufficent to conduct a thorough analysis.
                        As the system collects further data, the analysis will be updated to provide more information. Thank you!</p>}
                </div>
            </div>
    )
}
export default Feedback