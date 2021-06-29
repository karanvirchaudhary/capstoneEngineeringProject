import './App.css';
import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import axios from 'axios';
import LoginForm from './Component/LoginForm';
import Registration2 from './Component/Registration';
import Home from './Component/Home';
import Navbar from './Component/Navbar';
import Consumption from './Component/Consumption';

function App() {
  const [userID, setUserID] = useState("");
  useEffect(()=>{
    console.log(window.location.href);
    const url = window.location.href.slice(27,34);
    console.log(url);
    setUserID(url);
  },)
  
  return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact={true}>
              <LoginForm/>
            </Route>
            <Route path="/registration" exact={true}>
              <Registration2/>
            </Route>
            <Route path="/home" exact={true}>
              <Navbar/>
              <Home consumption={<Consumption/>}/>
            </Route>
            <Route path="/home/:userID" exact={true}>
              <Navbar user={userID}/>
              <Home user={userID} consumption={<Consumption/>}/>
            </Route>
            <Route path="/settings" exact={true}>
              <Navbar/>
            </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
