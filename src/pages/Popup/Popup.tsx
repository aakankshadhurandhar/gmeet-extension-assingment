import React, { useEffect, useState } from 'react';
import './Popup.css';
const icon = require('../../assets/img/meet.png');

const Popup: React.FC = () => {
  const [id, setid] = useState<number | string>('');
  const [email, setemail] = useState<string>('');
  const [isLoading, setisLoading] = useState<boolean | undefined>(false);

  useEffect(() => {
    //fetch from local storage every time the popup is activated
    chrome.storage.sync.get(['meetID'], (result) => {
      setid(result.meetID);
    });
    chrome.storage.sync.get(['email'], (result) => {
      setemail(result.email);
    });

    //Listens to messages sent by background
    chrome.runtime.onMessage.addListener(async function (request) {
      if (request.msg === 'something_completed') {
        //  To do something

        setisLoading(false);
        setid(request.meetID);
        setemail(request.org);
      }
      if (request.msg === 'copy_link') {
        copyToClip();
      }
      if (request.msg === 'user_changed') {
        setisLoading(false);
      }
      if (request.msg === 'btn_press') {
        setisLoading(true);
      }
    });
  }, []);

  const switchUser = () => {
    setid('');
    setemail('');
    setisLoading(true);

    chrome.storage.sync.set({ meetID: '' }, function () {
      console.log('Value is set to null');
    });
    chrome.storage.sync.set({ email: '' }, function () {
      console.log('Value is set to null');
    });

    chrome.runtime.sendMessage({ message: 'switch_user' });
  };

  const createMeet = () => {
    setisLoading(true);

    console.log('creating');
    chrome.runtime.sendMessage({ message: 'get_event' });
  };

  function copyToClip() {
    const content = document.getElementById('clip')!.onselect;

    document.execCommand('copy');
  }

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
                id="clip"
                onClick={copyToClip}
                value={id}
                readOnly="readonly"
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
};

export default Popup;
