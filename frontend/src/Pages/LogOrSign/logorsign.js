import React from 'react';
import { Link } from 'react-router-dom';
import './logorsign.css';
import "../theme.css";

function LogorsignPage() {

  const logoOne = require("./wallet.png");

  return (
    <div className='screen'>
        <div className='page'>
            <div className='c'>
                <h1 className='logo'>
                    WalletWise
                </h1>
                <img src={logoOne} alt="Wallet Icon" height={50} width={70}/>
                <div className='login'>
                    <div className="click">
                        <Link to={`/login`}>
                            <button type="button" className="next">
                                LogIn!
                            </button>
                        </Link>
                    </div>
                    <div className="click">
                        <Link to={`/signup`}>
                            <button type="button" className="next">
                                SignUp!
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default LogorsignPage;
