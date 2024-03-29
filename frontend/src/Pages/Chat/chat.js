import React, { useEffect, useState } from 'react';
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import Search from '../../partials/Search/search';
import { requestJA, getAllReq, getUsername, deleteReq, acceptReq, getAllJointAccounts, joinAccUser, getUserType, defaultUser, getUserID, getUserProfile } from '../../api.mjs';

export const ChatPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [jointAccounts, setJointAccounts] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const username = getUsername();
  const userType = getUserType();
  const userId = getUserID();


  useEffect(() => {
    // Fetch sent and received requests when the component mounts
    const fetchRequests = async () => {
      try {
        const result = await getAllReq(username);
        setSentRequests(result.sent);
        setReceivedRequests(result.received);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };
    

    fetchRequests();
  }, [username, sentRequests, receivedRequests]);

  useEffect(() => {
    // Fetch user profile information when the component mounts
    const fetchUserProfile = async () => {
      try {
        const result = await getUserProfile(userId, userType);
        setUserProfile(result);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [username, userType]);

  useEffect(() => {
    const fetchJointAccounts = async () => {
      try {
        const result = await getAllJointAccounts(username);
        setJointAccounts(result); 
      } catch (error) {
        console.error("Error fetching joint accounts:", error);
      }
    };
  
    fetchJointAccounts();
  }, [username]);

  const handleSendClick = () => {
    setSearchValue('');
    if (searchValue) {
      requestJA(searchValue, (err, result) => {
        if (err) {
          console.error("Error sending request:", err);
          // Handle error, e.g., show an error message
        } else {
          console.log("Request sent successfully");
          // Handle success, e.g., show a success message

          // Update the sentRequests state to reflect the new sent request
          setSentRequests([...sentRequests, searchValue]);
        }
      });
    } else {
      console.warn("Please enter a username before sending the request");
    }
  };


  const handleAccept = async (getUsername) => {
    try {
      // Assuming acceptReq is an asynchronous function that accepts a username
      await acceptReq(getUsername);
  
      console.log(`Accepted friend request from ${getUsername}`);
       // Update the receivedRequests state to reflect the accepted request
      setReceivedRequests((prevReceivedRequests) =>
        prevReceivedRequests.filter((req) => req.username !== getUsername)
      );
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };
  

  const handleDecline = async (username) => {
    //console.log("decline", username, );
  
    // Check if the requestId is valid
    if (!username) {
      console.error("Invalid request");
      return;
    }
  
    try {
      // Call the delete request API function
      await deleteReq(username);
  
      // Update the receivedRequests state to reflect the removal of the request
      setReceivedRequests((prevReceivedRequests) =>
        prevReceivedRequests.filter((req) => req.username !== username)
      );
    } catch (error) {
      console.error("Error deleting request:", error.message);
    }
  };

  const handleSwitch = async (accountId) => {
    console.log("join acc id front", accountId);
    try {
      // Call the joinAccUser API function to switch to the specified account
      await joinAccUser(accountId, (err, result) => {
        if (err) {
          console.error("Error switching account:", err);
          // Handle error, e.g., show an error message
        } else {
          console.log("Switched to account with ID:", accountId);
          // Handle success, e.g., update the UI or navigate to another page
        }
      });
    } catch (error) {
      console.error("Error switching account:", error);
    }
  };
  
  const handleSwitchUser = async (username) => {
    console.log("username to switch", username);
    try {
      // Call the joinAccUser API function to switch to the specified account
      await defaultUser(username, (err, result) => {
        if (err) {
          console.error("Error switching account:", err);
          // Handle error, e.g., show an error message
        } else {
          console.log("Switched to account with ID:", username);
          // Handle success, e.g., update the UI or navigate to another page
        }
      });
    } catch (error) {
      console.error("Error switching account:", error);
    }
  };
  
  
  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          <div className="middle">
          <Card key={1}>
              <h2 className="category">Profile</h2>
              <div className="req">
              <div>
                {userType === 'JA' ? (
                  <>
                    <p className='content'>Username 1: {userProfile.user1}</p>
                    <p className='content'>Username 2: {userProfile.user2}</p>
                  </>
                ) : (
                  <>
                    <div className='content'>Username:{userProfile.username}</div>
                    <p className='content'>Email: {userProfile.email}</p>
                  </>
                )}
              </div>
            </div>
            </Card>
            <Card key={2}>
  <h2 className="category">Joint Accounts</h2>
  <div className="req">
    {jointAccounts ? (
      jointAccounts.map((account, index) => (
        <div key={index} className="grid grid-cols-3 items-center mb-4 ml-2">
          <div>{`${account[0]} & ${account[1]}`}</div>
          <div className="flex justify-end flex-grow">
            <button className='del' onClick={() => handleSwitch(account[2])}>Switch</button>
          </div>
        </div>
      ))
    ) : (
      <p>Loading joint accounts...</p>
    )}

    <div className="grid grid-cols-3 items-center mb-4 ml-2">
      {userType === "JA" ? (
        <>
          <div>{username}</div>
          <div className="flex justify-end flex-grow">
            <button className='del' onClick={() => handleSwitchUser(username)}>Switch</button>
          </div>
        </>
      ) : null}
    </div>
  </div>
</Card>

            {userType === "UserColl" && (
              <>
                <Card key={3}>
                  <h2 className="category">Friend Requests</h2>
                  <div className="req">
                    <p className='content'>Pending friend requests will be displayed here.</p>
                    {receivedRequests.map((request, index) => (
                      <div key={index} className="grid grid-cols-3 items-center mb-4 ml-2">
                        <span className="col-span-2">{request}</span>
                        <div className="flex justify-end mr-4"> 
                          <button className='next' onClick={() => handleAccept(request)}>Accept</button>
                          <button className='next' onClick={() => handleDecline(request)}>Decline</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card key={4}>
                  <h2 className="category">Sent Requests</h2>
                  <div className="req grid grid-cols-1 items-center ml-2">
                    <p className='content'>List of sent friend requests and requests sent by you.</p>
                    
                    <div className="search-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <Search onChange={(value) => setSearchValue(value)} />
                      {searchValue && (
                        <button onClick={handleSendClick}>Send</button>
                      )}
                    </div>

                    {sentRequests.map((request, index) => (
                      <div key={index} style={{ margin: '10px' }}>Request sent to: {request}</div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
