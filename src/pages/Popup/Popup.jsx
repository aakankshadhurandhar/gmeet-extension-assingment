
  
import React, { Component } from 'react';
import logo from '../../assets/img/logo.svg';
import './Popup.css';
import icon from '../../assets/img/meet.png';

class Popup extends Component {
  
  render() {
    return (
      <div className="App">
      <div className="nav">
        <div className="welcome"></div>
        <div className="switch">
          <h3 onClick={this.switchUser} className="switch-img">
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
              onClick={this.createMeet}
              disabled={this.state.isLoading}
            >
              {this.state.isLoading ? (
                <div className="loader"></div>
              ) : (
                <span>&#x2b; &nbsp;New meeting</span>
              )}
            </button>
          </div>
          <div className="shortcut">
            <p className="clipboard-para">
              Click above or press Alt+N to create a new meeting
            </p>
          </div>
        </div>
        {this.state.id && (
          <div className="clipboard">
            <div>
              <input
                className="clipboard-input"
                id="con"
                onClick={this.copyToClip}
                value={this.state.id}
                readOnly="readOnly"
              />
              <p className="clipboard-para">
                Click above to copy the Link or press Alt+C
              </p>
            </div>
          </div>
        )}
      </div>
      {this.state.email && (
        <div>
          <p className="footer">Organizer: {this.state.email}</p>
        </div>
      )}
    </div>
    );
  }
}

export default Popup;
