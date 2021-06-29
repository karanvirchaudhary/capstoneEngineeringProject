import React, {useState,useEffect} from 'react';

function Consumption(props){ 

    const [totalCost, setTotalCost] = useState("$0.00");
    const [totalConsumption, setTotalConsumption] = useState(0); 
    const [litresData, setLitresData] = useState([]);
    const [userID, setUserID] = useState(props.user);

    useEffect(()=>{
        fetch("https://api.thingspeak.com/channels/1160881/fields/3.json?api_key=473GSMPC4BD4R44T&days=1")
        .then((res)=>res.json())
        .then((data) => setLitresData(data.feeds))
    },[])

    //console.log(litresData);

    useEffect(()=>{
        //Now we want to calculate the total consumption.
        function calculateTotalConsumption(){
            let totalSum = 0;
            litresData.forEach(data=>{
                if(data.field3 === null){
                }
                else if(data.field3 === ""){
                }
                else{
                    totalSum += parseFloat(data.field3);
                }
            })
            return totalSum.toFixed(3);
        }

        //Depending on the user's region, the app will generate a cost-equivalent for their consumption
        function calculateTotalCost(region){
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

        const totalCons = calculateTotalConsumption();
        const costTotal = calculateTotalCost("Ottawa");
        setTotalConsumption(totalCons);
        setTotalCost(costTotal);
    },)
    //console.log(totalConsumption, totalCost);
    
    
    return(
        <div className="form-group row">
            <div className="col-lg-12 col-md-12 col-sm-12 consumption">
                <div className="row">
                    <div className="col-lg-6 cText">
                        <h4 className="mainHeadings">Consumption</h4>
                        <p>Your utilties consumption for the past 12 hrs:</p>
                        <ul>
                            <li><b>Total Consumption:</b> {totalConsumption}L</li>
                            <li><b>Total Cost:</b> ${totalCost}</li>
                        </ul>
                    </div>
                    <div className="col-lg-6 graph">
                        <iframe className="consumptionData" src="https://thingspeak.com/channels/1160881/charts/3?api_key=473GSMPC4BD4R44T&bgcolor=%23ffffff&color%23d62020&dynamic=true&results=60&type=line&update=15"></iframe>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Consumption 