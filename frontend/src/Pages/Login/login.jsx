import './login.css';
import '../theme.css';
import wallet from "./wallet.png";
import { Input } from "../../components/LoginComponents/Input";
import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { signin } from '../../api.mjs'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios


function LoginPage() {
 
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");

const usernameFormatRegex = /^[A-Za-z0-9_]+$/;
const passwordFormatRegex = /^[A-Za-z0-9]+$/;

const [isUsernameValid, setIsUsernameValid] = useState(true);
const [isPasswordValid, setIsPasswordValid] = useState(true);

const [loginError, setLoginError] = useState(null);

const navigate = useNavigate();

// const handleLogIn = () => {
//   // Reset login error on each login attempt
//   setLoginError(null);

//   // Validate input fields before making the signup request
//   if (usernameFormatRegex.test(username) && passwordFormatRegex.test(password)) {
//     // Call the signin function from your API file using fetch
//     fetch('http://localhost:4000/signin', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log('Login successful:', data);
//         navigate('/dashboard'); // Redirect the user to the dashboard
//       })
//       .catch((error) => {
//         console.error('Login failed:', error);
//         // Handle the case where the login failed (show an error message to the user, etc.)
//         setLoginError("Invalid username or password. Please try again.");
//       });
//   } else {
//     // Handle invalid input case (show an error message to the user, etc.)
//     setLoginError("Invalid input. Please check your username and password.");
//   }
// };

// const handleLogIn = () => {
//   // Reset login error on each login attempt
//   setLoginError(null);

//   // Validate input fields before making the signup request
//   if (usernameFormatRegex.test(username) && passwordFormatRegex.test(password)) {
//     // Call the signin function from your API file using fetch
//     fetch('http://localhost:4000/signin', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ username, password }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         return response.send();
//       })
//       .then((data) => {
//         console.log('Login successful:', data);
//         navigate('/dashboard'); // Redirect the user to the dashboard
//       })
//       .catch((error) => {
//         console.error('Login failed:', error);
//         // Handle the case where the login failed (show an error message to the user, etc.)
//         setLoginError("Invalid username or password. Please try again.");
//       });
//   } else {
//     // Handle invalid input case (show an error message to the user, etc.)
//     setLoginError("Invalid input. Please check your username and password.");
//   }
// };

const handleLogIn = () => {
  // Reset login error on each login attempt
  setLoginError(null);

  // Validate input fields before making the signup request
  if (usernameFormatRegex.test(username) && passwordFormatRegex.test(password)) {
    // Use Axios for the API call
    axios.post('http://localhost:4000/signin', { username, password })
      .then((response) => {
        console.log('Login successful:', response.data);
        navigate('/dashboard'); // Redirect the user to the dashboard
      })
      .catch((error) => {
        console.error('Login failed:', error);
        // Handle the case where the login failed (show an error message to the user, etc.)
        setLoginError("Invalid username or password. Please try again.");
      });
  } else {
    // Handle invalid input case (show an error message to the user, etc.)
    setLoginError("Invalid input. Please check your username and password.");
  }
};

  return (
    <div className='screen'>
        <div className='page'>
            <div className='c'>
                <h1 className='logo'>
                    WalletWise
                </h1>
                    <img src={wallet} alt="Wallet Icon"/>
                <div className='login'>
                    <div className='pic'>
                        <div className='uploadpic'></div>
                        <h1 className='welcome'>Welcome Back! Please Login.</h1>
                    </div>
                    <div className='input'>
                        <Input
                          type="username"
                          placeholder={"user_name"}
                          header="Username:"
                          value={username}
                          setter={(value) => {
                            setUsername(value);
                            setIsUsernameValid(usernameFormatRegex.test(value));
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
                    </div>
                    <div className="click">
                  {usernameFormatRegex.test(username) && passwordFormatRegex.test(password) ? (
                    <button type="button" className="next" onClick={handleLogIn}>
                      DONE
                    </button>
                  ) : (
                    <button type="button" className="next" disabled>
                      DONE
                    </button>
                  )}
                  </div>
                  <div className='error'>
                    {loginError && <div className="error-message">{loginError}</div>}
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}

export default LoginPage;