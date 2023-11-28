import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import QRcomp from '../components/QRcode/qrcode';

function Sidebar() {
  //console.log("Username in Sidebar:", username);
  const logoOne = require("./wallet.png");
  const dash = require("./dash.png");
  const chat = require("./chat.png");
  const expense = require("./expenses.png");
  const budget = require("./budget.png");

  return (
    <div className='side'>
      <NavLink to="/"  activeclassname='l'>
        <h1 className='l'>
          WalletWise
          <img src={logoOne} alt="Wallet Icon" className="w-20 h-20 img1" />
        </h1>
      </NavLink>
      <div className='tabs'>
        <div className='row1'>
        <img src={dash} alt="Dashboard Icon" className="w-6 h-6 img1" />
          <NavLink to="/dashboard"  activeclassname='d'>
            <h1 className='dash'>Dashboard</h1>
          </NavLink>
        </div>
        <div className='row2'>
        <img src={expense} alt="Expense Icon" className="w-6 h-6 img2" />
          <NavLink to="/expenses"  activeclassname='e'>
            <h1 className='expenses'>Expenses</h1>
          </NavLink>
        </div>
        <div className='row3'>
        <img src={budget} alt="Budget Icon" className="w-6 h-6 img3" />
          <NavLink to="/budget" activeclassname='b'>
            <h1 className='budgets'>Budget</h1>
          </NavLink>
        </div>
        <div className='row4'>
        <img src={chat} alt="Chat Icon" className="w-6 h-6 img4" />
          <NavLink to="/chat" activeclassname='c'>
            <h1 className='chat'>ChatAI</h1>
          </NavLink>
        </div>
      </div>
      <div className='qr'>
        <h1 className='prompt'>Add Expense</h1>
        <p className='scan'>scan:</p>
        <div className='box'>
          <QRcomp/>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
