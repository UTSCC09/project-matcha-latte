import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./signup.css";
import "../theme.css";
import '../LogOrSign/logorsign.css';
import { Input } from "../../components/SignupComponents/Input";
import { signup } from '../../api.mjs'; 


export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [salary, setSalary] = useState("");

  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isSalaryValid, setIsSalaryValid] = useState(true);

  const logoOne = require("./wallet.png");

    const emailFormatRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameFormatRegex = /^[A-Za-z0-9_]+$/;
    const passwordFormatRegex = /^[A-Za-z0-9]+$/;
    const salaryFormatRegex = /^\$\d+(\,\d{3})*(\.\d{2})?$/;



    const handleSignUp = () => {
      // Validate input fields before making the signup request
      if (emailFormatRegex.test(email) && nameFormatRegex.test(username) && passwordFormatRegex.test(password) ) {
        // Call the signup function from your API file
        signup(username, password, email, (error, response) => {
          if (error) {
            console.error('Signup failed:', error);
            // Handle the error (show an error message to the user, etc.)
          } else {
            console.log('Signup successful:', response);
            // Redirect the user to the next page or perform any other actions
          }
        });
      } else {
        // Handle invalid input case (show an error message to the user, etc.)
      }
    };
    
  return (
    <div className="screen">
      <div className="page">
        <div className="c">
        <h1 className='logo'>
                    WalletWise
                </h1>
                    <img src={logoOne} alt="Wallet Icon" height={50} width={70}/>
          <div className="login">
            <div className="pic">
              <div className="uploadpic"></div>
              <h1 className="addpic">
                Add a profile picture!
              </h1>
            </div>
            <div className='input'>
            <Input
              type="email"
              placeholder={"first.last@mail.com"}
              header="Email:"
              value={email}
              setter={(value) => {
                setEmail(value);
                setIsEmailValid(emailFormatRegex.test(value));
              }}
              isValid={isEmailValid}
              errorMessage="Please enter a valid email address."
            />
            <Input
              type="username"
              placeholder={"user_name"}
              header="Username:"
              value={username}
              setter={(value) => {
                setUsername(value);
                setIsUsernameValid(nameFormatRegex.test(value));
              }}
              isValid={isUsernameValid}
              errorMessage="Username can only contain letters, numbers, and underscores."
            />
            <Input
              type="password"
              placeholder={"password1234"}
              header="Password:"
              value={password}
              setter={(value) => {
                setPassword(value);
                setIsPasswordValid(passwordFormatRegex.test(value));
              }}
              isValid={isPasswordValid}
              errorMessage="Password can only contain letters and numbers."
            />
            <Input
              type="salary"
              placeholder={"$60000"}
              header="Monthly Salary:"
              value={salary}
              setter={(value) => {
                setSalary(value);
                setIsSalaryValid(salaryFormatRegex.test(value));
              }}
              isValid={isSalaryValid}
              errorMessage="Salary must contain a $ and a decimal (.)."
            />
            </div>
            <div className="click">
              {(emailFormatRegex.test(email) && nameFormatRegex.test(username) && passwordFormatRegex.test(password) && salaryFormatRegex.test(salary)) ? (
                <Link to={`/dashboard
                `}>
                  <button type="button" className="next" onClick={handleSignUp} >
                    NEXT
                  </button>
                </Link>
              ) : (
                <button type="button" className="next">
                NEXT
              </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
