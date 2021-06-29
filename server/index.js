const express = require("express");
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const {MongoClient} = require('mongodb');
const uri = "mongodb+srv://zoro:zoro@cluster0.dpot9.mongodb.net/test?retryWrites=true&w=majority";
const PORT = process.env.PORT || 3001; 
var startingID = 100;
const app = express();

//Connecting to the ThingSpeak API 
var ThingSpeakClient = require('thingspeakclient');
var thingsClient = new ThingSpeakClient();
thingsClient.attachChannel(1160881, {writeKey:'POEWLXNFCKIFB7ZX', readKey:'473GSMPC4BD4R44T'});

//The following lines are code are for the email functionality 
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'outlook',
  auth:{
    user: 'karanvir@hotmail.ca',
    pass: '#####'
  }
});

var mailOptions={
  from: 'karanvir@hotmail.ca',
  to:'capstoneprojectdemo@outlook.com',
  subject: 'Actuator Status Update',
  text: 'Actuator is currently online!'
}; 
//First things first, we need to connectthe database
MongoClient.connect(uri, {useNewUrlParser:true, useUnifiedTopology:true})
.then(client=>{
  const db = client.db('data');
  console.log('connected');
  const userCollection = db.collection('userData');
  app.use(
    cors({
      origin:'http://localhost:3000',
      credentials:true,
    })
  );
  app.use(bodyParser.urlencoded({extended:true}))

  app.post('/testCreateUser', (req,res)=>{
    let temp = req.body;
    console.log(temp);
    if(temp.firstname ==="" || temp.lastname === "" || temp.phoneNum === "" || temp.email === ""|| temp.province ===""|| temp.region === ""){
      res.redirect('/registration');
    } else{
      temp.userID = "1160881";
      temp.startActuatorTime = "";
      temp.stopActuatorTime = "";
      userCollection.insertOne(temp)
      .then(result=>{
        //console.log(req.body);
        res.redirect('/');
        
      })
      .catch(error=>console.error(error))
    }
  });

  app.post('/login', (req,res)=>{
    let temp = req.body;
    //Let's see if the userEmail exists in the database. 
    userCollection.findOne({email:temp.email})
    .then(result=>{
      if(result !== null){
        //If the user exists in the database, and if their passwords match then take them to the home page
        if(result.password === temp.password){
          res.redirect(`/home/${result.userID}`);
        }
      }else{
        res.redirect("/"); //Otherwise take them back to the login page
      }
    })
    .catch(error=>console.error(error))
  });

  app.post('/uploadSettings', (req,res)=>{
    let temp = req.body;
    userCollection.findOneAndUpdate(
      {userID:temp.userID}, {
        $set:{
          startActuatorTime: temp.startTime,
          stopActuatorTime: temp.endTime
        }
      }
    )
    .then(result=>{
      if(result !== null){
        res.redirect(`/home/${temp.userID}`);
      }else{
        //console.log("empty");
        res.redirect('/');
      }
    })
    .catch(error=>console.error(error))
    if(temp.startTime !== "" && temp.endTime !==""){
        const field6String = temp.startTime;
        const field6End = temp.endTime;
        const finalString = field6String.concat("-",field6End);
        //console.log(finalString);
        //Create a new job request 
        thingsClient.updateChannel(1160881,{field1:"1160881", field2:'newJob', field3:"", field4:"", field5:"", field6:finalString}, function(err, resp){
          if(!err && resp >0){
            //console.log('Update successfully. Entry number was ' + resp);
          }
        })
        //Once the request has been successfuly sent, send an email to the user. 
        transporter.sendMail(mailOptions, function(error, info){
          if(error){
            //console.log(error);
          } else{
            //console.log('Email sent:'+info.response);
            }
        });
    }else{
      var userActuatorToggle = false;
      userCollection.findOne({userID:temp.userID})
      .then(result=>{
        if(result !== null){
          //If the user exists in the database then take them to the home page
          //console.log("Found"+ result.userID);
          userActuatorToggle = True
          res.redirect('/registration');
        }else{
          res.redirect("/"); //Otherwise take them back to the login page
        }
      })
      .catch(error=>console.error(error))
    }
  });

  //Testing
  app.get("/api", (req,res) =>{
    res.json({message:"Hello from server!"});
  });

})
.catch(err=>console.error(err))

app.use(
  cors({
    origin:'http://localhost:3000',
    credentials:true,
  })
);

app.post('/api/now',(req,res)=>{
  //console.log(typeof req.body);
  const field5Val = "True";

  thingsClient.updateChannel(1160881,{field1:711, field2:'actuateNow', field3:"", field4:"", field5:field5Val, field6:""}, function(err, resp){
    if(!err && resp >0){
      console.log('Update successfully. Entry number was ' + resp);
    }
  });

  //Once the request has been successfuly sent, send an email to the user. 
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      //console.log(error);
    } else{
      //console.log('Email sent:'+info.response);
    }
  });

  res.send(`Server received the POST request to update the thingSpeak channel`);
})
/*
app.post('/createUser', (req,res)=>{
  console.log("Received post");
  res.json({requestBody:req.body}); 
  console.log(typeof res);
})

app.get("/api", (req,res) =>{
  res.json({message:"Hello from server!"});
});
*/

app.listen(PORT, () => {
  //console.log(`Server listening on ${PORT}`);
});
