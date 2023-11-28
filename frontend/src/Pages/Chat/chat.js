import './chat.css';
import '../theme.css';
import '../../partials/sidebar.css'
import Sidebar from '../../partials/sidebar';
import React from "react";

export const ChatPage = () =>{
    
    return (
    <div className="screen">
      <div className="page">
        <div className="center">
        <Sidebar/>
        </div>
      </div>
    </div>
    );
};

export default ChatPage;