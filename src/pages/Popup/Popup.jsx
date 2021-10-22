
  
import React, { Component, useEffect, useState } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import icon from '../../assets/img/meet.png';

function Popup () {
  // eslint-disable-next-line no-useless-constructor
  const[id,setid]=useState('')
  const[email,setemail]=useState('')
  const[isLoading,setisLoading]=useState(false)

  
  
  useEffect(() =>{
    //fetch from local storage every time the popup is activated
    chrome.storage.sync.get(['meetID'], (result) => {
      console.log('Value currently is ' + result);
      setid(result.meetID)
      
    });
    chrome.storage.sync.get(['email'], (result) => {
      console.log('Value currently is ' + result);
      setemail(result.email)
     
    });

    //Listens to messages sent by background
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.msg === 'something_completed') {
        //  To do something
        console.log(request);
        setisLoading(false)
        setid(request.meetID)
        setemail(request.org)
        
      }
      if (request.msg === 'copy_link') {
        copyToClip();
      }
      if (request.msg === 'user_changed') {
        console.log('inside user change');
        setisLoading(false)
       
      }
      if (request.msg === 'btn_press') {
        console.log('inside btn press');
        setisLoading(true)
        
      }
    });
  })

  const switchUser = () => {
    setid('')
    setemail('')
    setisLoading(true)
    

    chrome.storage.sync.set({ meetID: '' }, function () {
      console.log('Value is set to null');
    });
    chrome.storage.sync.set({ email: '' }, function () {
      console.log('Value is set to null');
    });

    chrome.runtime.sendMessage({ message: 'switch_user' });
  };

  const createMeet = () => {
    setisLoading(true)
    
    console.log('creating');
    chrome.runtime.sendMessage({ message: 'get_event' });
  };

  const copyToClip = () => {
    console.log('Copying...');
    let content = document.getElementById('con');
    content.select();
    document.execCommand('copy');
  };
  
  
    return (
      <div className="App">
      <div className="nav">
        <div className="welcome"></div>
        <div className="switch">
          <h3 onClick={switchUser} className="switch-img">
            Switch User
          </h3>
        </div>
      </div>

      <div className="main">
        <div className="container">
          <div className="meet">
            <div className="icon">
              <img src={icon} width="40px" alt="" />
            </div>
            <button
              className="meetBtn"
              onClick={createMeet}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loader"></div>
              ) : (
                <span>&#x2b; &nbsp;New meeting</span>
              )}
            </button>
          </div>
          <div className="shortcut">
            <p className="clipboard-para">
              Click above or press Alt+X to create a new meeting
            </p>
          </div>
        </div>
        {id && (
          <div className="clipboard">
            <div>
              <input
                className="clipboard-input"
                id="con"
                onClick={copyToClip}
                value={id}
                readOnly="readOnly"
              />
              <p className="clipboard-para">
                Click above to copy the Link or press Alt+Y
              </p>
            </div>
          </div>
        )}
      </div>
      {email && (
        <div>
          <p className="footer">Organizer: {email}</p>
        </div>
      )}
    </div>
    );
  }


export default Popup;
