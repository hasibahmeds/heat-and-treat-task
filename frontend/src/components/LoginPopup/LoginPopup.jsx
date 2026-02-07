import { useContext, useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios"
import { FiEye, FiEyeOff } from "react-icons/fi"; // ← Added icons for show/hide

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUserEmail } = useContext(StoreContext)
  const [currState, setCurrState] = useState("Login")
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [showPassword, setShowPassword] = useState(false); // ← NEW: Toggle state

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  }

  const onLogin = async (event) => {
    event.preventDefault()
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login"
    } else {
      newUrl += "/api/user/register"
    }
    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      const email = response.data.email || data.email;
      setUserEmail(email);
      localStorage.setItem("userEmail", email);
      setShowLogin(false);
    } else {
      alert(response.data.message)
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt='' />
        </div>
        <div className="login-popup-inputs">
          {currState === "Login" ? <></> : 
            <input name='name' onChange={onChangeHandler} value={data.name} type='text' placeholder='Your name' required />
          }
          <input name='email' onChange={onChangeHandler} value={data.email} type='email' placeholder='Your email' required />
          
          {/* Password field with toggle */}
          <div className="password-wrapper">
            <input
              name='password'
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              required
            />
            <span className="password-toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
        </div>

        <button type='submit'>{currState === "Sign Up" ? "Create account" : "Login"}</button>
        <div className="login-popup-condition">
          <input type='checkbox' required />
          <p className='byc'>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login"
          ? <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
          : <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        }
      </form>
    </div>
  )
}

export default LoginPopup