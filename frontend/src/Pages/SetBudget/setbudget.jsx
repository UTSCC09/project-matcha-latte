import React from 'react';
import './setbudget.css';
import '../theme.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from "../../components/SetBudgetComponents/Input";


function SetbudgetPage() {

const [budget, setBudget] = useState("");


const moneyFormatRegex = /^\$\d+(\,\d{3})*(\.\d{2})?$/;

  return (
    <div className='screen'>
        <div className='page'>
            <div className='c'>
                <h1 className='logo'>
                    WalletWise
                </h1>
                <div className='login'>
                    <div className='pic'>
                        <div className='uploadpic'></div>
                        <h1 className='welcome'>Please set your budget goal!</h1>
                    </div>
                    <div className='input'>
                    <Input
                        type="budget"
                        placeholder={"$00.00"}
                        header="Set Budget"
                        value={budget}
                        setter={setBudget}
                        />
                    </div>
                    <div className='click'>
                    {(moneyFormatRegex.test(budget)) ? (
                <Link to={`/dashboard`}>
                  <button type="button" className="next">
                    DONE
                  </button>
                </Link>
              ) : (
                <button type="button" className="next" disabled>
                  DONE
                </button>
              )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default SetbudgetPage;
