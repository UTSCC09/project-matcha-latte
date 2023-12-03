import React, { useEffect, useState } from 'react';
import Sidebar from '../../partials/sidebar';
import Card from '../../partials/Cards/cards';
import Search from '../../partials/Search/search';
import { requestJA, getAllReq, getUsername, deleteReq, acceptReq } from '../../api.mjs';

export const ChatPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  const username = getUsername();


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
  
  
  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          <Sidebar />
          <div className="middle">
          <Card key ={1}>
       <h2 className="category">Profile</h2>
               <div className="req">
                   <p>Your profile information goes here.</p>
               </div>
             </Card>
             <Card key ={2}>
               <h2 className="category">Joint Accounts</h2>
               <div className="req">
                   <p>Information about joint accounts goes here.</p>
               </div>
             </Card>
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
              <div className="req">
                <p className='content'>List of sent friend requests and requests sent by you.</p>
                <Search onChange={(value) => setSearchValue(value)}></Search>
                {searchValue && (
                  <button onClick={handleSendClick}>Send</button>
                )}
                {sentRequests.map((request, index) => (
                  <div key={index}>{request}</div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
