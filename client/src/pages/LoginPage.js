  
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
  const [showRegister, setShowRegister] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);
  const [correctCredentials, setCorrectCredentials] = useState(false);
  
  const [credentials, setCredentials] = useLoginHook({
    mail: '',
    password: ''
  });

  const [registerInfo, setregisterInfo] = useLoginHook({
    mail: '',
    firstName: '',
    lastName: '',
    className: '',
    password: '',
    password2: ''
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

  const register = () => {

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registerInfo)
    };

   

    fetch("/api/register", requestOptions).then(response => response.json()).then(response => {
      if (response === true) {
        reward.rewardMe();
        setWrongCredentials(false);
        setCorrectCredentials(true);
        setTimeout(()=> window.location.reload(),1000)
      }
      else {
        reward.punishMe();
        console.log( response)
        setWrongCredentials(true);
      }

    })
     
  };

  const registerForm = (bool) => {
    setShowRegister(bool);
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

       
        

      {(showRegister) ? 
      <div className="center-login">

<p>Regsitrera</p>

        <div className="register-box glassMorphism">
        
        <div className="register-user">
          <input value={registerInfo.mail} name="mail" type="text" onChange={setregisterInfo} onKeyDown={(e) => loginForm(e)} placeholder="Mail (elev.ga.ntig.se)" />
        </div>

        <div className="register-firstName">
          <input value={registerInfo.firstName} name="firstName" type="text" onChange={setregisterInfo} onKeyDown={(e) => loginForm(e)} placeholder="Förnamn" />
        </div>

        <div className="register-lastName">
          <input value={registerInfo.lastName} name="lastName" type="text" onChange={setregisterInfo} onKeyDown={(e) => loginForm(e)} placeholder="Efternamn" />
        </div>

        <div className="register-className">
          <input value={registerInfo.className} name="className" type="text" onChange={setregisterInfo} onKeyDown={(e) => loginForm(e)} placeholder="Klass" />
        </div>

        <div className="register-password">
          <input name="password" type="password" onChange={setregisterInfo} onKeyDown={(e) => loginForm(e)} placeholder="Lösenord"/>
        </div>

        <div className="register-password2">
          <input name="password2" type="password" onChange={setregisterInfo} onKeyDown={(e) => loginForm(e)} placeholder="Upprepa lösenord"/>
        </div>

        <div className="register-button" >
          <Reward ref={ref => { reward = ref }} type='memphis'>
              <button type="button" onClick={() => { register() }} class="btn btn-primary button-gradient">Regsitrera</button>
              {(wrongCredentials) ? <div style={{color:"red"}}>Fel uppgifter</div> : null }
              {(correctCredentials) ? <div style={{color:"green"}}>Välkommen!</div> : null }
          </Reward>
        </div>

        <div className="test-button" >
          
        <button type="button" onClick={() => { registerForm(false) }} class="btn btn-primary button-gradient">Logga in istället</button>
              
        </div>



</div>
</div>

: 
      
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
        <div className="test-button" >
          
              <button type="button" onClick={() => { registerForm(true) }} class="btn btn-primary button-gradient">Registrera</button>
              
        </div>
      


        </div>
        </div>
}
       

        

      </div>
  
  
  
  )
};

export default LoginPage;