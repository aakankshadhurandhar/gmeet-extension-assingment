import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import browser from 'webextension-polyfill';
function Commands(command: string) {
  try {
    if (command === 'copy-link') {
      chrome.runtime.sendMessage({
        msg: 'copy_link',
      });
    } else if (command === 'create-meeting') {
      chrome.runtime.sendMessage({
        msg: 'btn_press',
      });
      createMeeting();
    } else alert('wrong command');
    chrome.commands.onCommand.removeListener(Commands);
  } catch (e) {
    alert('Some error there please wait');
  }
}
// Listening to key press events
chrome.commands.onCommand.addListener(function (command) {
  Commands(command);
});

/* function which creates the meeting*/
function createMeeting() {
  chrome.identity.getAuthToken(
    { interactive: true },
    async function (token: string) {
      if (!token) {
        alert('someproblem is there hang inn... ');
      }

      //by default time for meeting is 60 min
      let startDate = new Date();
      let endDate = new Date(startDate.getTime() + 3600000);
      let isoStartDate = new Date(
        startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split('.')[0];
      let isoEndDate = new Date(
        endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .split('.')[0];
      //details about the event
      let event = {
        summary: 'Create Google meet Meeting',
        description: 'Google Meeting created using a chrome extension GMeet',
        start: {
          dateTime: `${isoStartDate}`,
          timeZone: 'Asia/Kolkata',
        },
        end: {
          dateTime: `${isoEndDate}`,
          timeZone: 'Asia/Kolkata',
        },
        conferenceData: {
          createRequest: { requestId: '7qxalsvy0e' },
        },
      };

      let fetch_options = {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      };

      await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        fetch_options
      )
        .then((response) => response.json())
        // Transform the data into json
        .then(function (data) {
          console.log(data);
          chrome.storage.sync.set({ meetID: data.hangoutLink }, function () {
            console.log('Value is set to ' + data.hangoutLink);
          });
          chrome.storage.sync.set({ email: data.creator.email }, function () {
            console.log('Value is set to ' + data.creator.email);
          });
          chrome.runtime.sendMessage({
            msg: 'something_completed',
            meetID: data.hangoutLink,
            org: data.creator.email,
          });
        })
        .catch((err) => alert('please reload extension'));
    }
  );
}
//get authtoken doesnot support promises
function Switchuser() {
  try {
    chrome.identity.getAuthToken(
      { interactive: true },
      async function (token: string) {
        if (chrome.runtime.lastError) {
          alert('please wait something wrong');
        }

        if (!chrome.runtime.lastError) {
          let url =
            'https://accounts.google.com/o/oauth2/revoke?token=' + token;
          await fetch(url).then(() => {
            chrome.identity.removeCachedAuthToken(
              { token: token },
              function () {
                chrome.identity.getAuthToken(
                  { interactive: true },
                  function (token) {
                    chrome.runtime.sendMessage({
                      msg: 'user_changed',
                    });
                  }
                );
              }
            );
          });
        }
      }
    );
  } catch (e) {
    alert('please wait some problem there');
  }
}

function Trigger(request: any) {
  try {
    if (request.message === 'get_event') {
      createMeeting();
    } else if (request.message === 'switch_user') {
      Switchuser();
    } else {
      alert('hold on something wrong');
    }

    chrome.runtime.onMessage.removeListener(Trigger);
  } catch (e) {
    alert('please wait some problem there');
  }
}

//Listening to event triggers from the frontend
chrome.runtime.onMessage.addListener(function (request: any) {
  Trigger(request);
});
