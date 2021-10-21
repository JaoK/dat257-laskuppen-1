  
import fetch from "node-fetch";
import React, { useEffect, useState } from "react";
import Reward from "react-rewards";
import { useHistory } from 'react-router-dom';
import {  faTrophy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./css/loginpage.css";

const useLoginHook = (formValues) => {
  const [values, handleChange] = useState(formValues);

  return [values, e => {
    handleChange({
      ...values,
      [e.target.name]: e.target.value
    });
  }];
};

const LoginPage = (props) => {
  
  var reward;
  const [loggedIn, setLoggedIn] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(false);
  
  const [credentials, setCredentials] = useLoginHook({
    mail: null,
    password: null
  });

  const history = useHistory();

  useEffect(() => {
    if (props.logout === true) {
      fetch("/api/logout").then(response => response.json()).then(response => {
        history.push('/')
        window.location.reload();
      })
    }
    else {
      fetch("/api/session").then(response => response.json()).then(response => {
        if (response.login === true) {
          setLoggedIn(true);
        }
      });
    }
  }, [])


  const login = () => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    };


    fetch("/api/login", requestOptions).then(response => response.json()).then(response => {
      if (response === true) {
        reward.rewardMe();
        setWrongCredentials(false);
        setCorrectCredentials(true);
        setTimeout(()=> window.location.reload(),1000)
      }
      else {
        reward.punishMe();
        setWrongCredentials(true);
      }

    })

  };

  const loginForm = (e) => {
    if (e.key === 'Enter') {
      login()
    } 
  }

  return (
    <div className="login-page">
      <span className="logo"> 
        <h1><FontAwesomeIcon icon={faTrophy} color='white' /> Läskuppen </h1> 
      </span>

      <div className="center-login"> 
        
        <p>Välkommen till Läskuppen!</p>

        <div className="login-box glassMorphism">
        <div className="login-user">
          <input value={credentials.mail} name="mail" type="text" onChange={setCredentials} onKeyDown={(e) => loginForm(e)} placeholder="Användarnamn" />
        </div>

        <div className="login-password">
          <input name="password" type="password" onChange={setCredentials} onKeyDown={(e) => loginForm(e)} placeholder="Lösenord"/>
        </div>

        <div className="login-button" >
          <Reward ref={ref => { reward = ref }} type='memphis'>
              <button type="button" onClick={() => { login() }} class="btn btn-primary button-gradient">Logga in</button>
              {(wrongCredentials) ? <div style={{color:"red"}}>Fel uppgifter</div> : null }
              {(correctCredentials) ? <div style={{color:"green"}}>Välkommen!</div> : null }
          </Reward>
        </div>
      


        </div>
       

        

      </div>
    </div>
  
  
  )
};

export default LoginPage;