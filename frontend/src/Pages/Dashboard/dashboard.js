import './dashboard.css';
import '../theme.css';
import '../../partials/sidebar.css'
import Sidebar from '../../partials/sidebar';
import React, { useState, useEffect } from "react";

export const DashboardPage = () => {

  return (
    <div className="screen">
      <div className="page">
        <div className="center">
          {/* Pass the session.username to the Sidebar component */}
          <Sidebar  />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
