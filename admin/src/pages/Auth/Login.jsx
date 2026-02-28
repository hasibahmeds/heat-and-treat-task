import { useState } from "react";
import "./Auth.css";
import "../../components/LoginPopup/LoginPopup.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // State for visibility
  const [loading, setLoading] = useState(false); // 🔥 Loading state

  const onChange = (e) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🔥 Start loading
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/add");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // 🔥 Stop loading
    }
  };

  return (
    <div className="auth-page">
      <div className="login-popup">
        <form onSubmit={onSubmit} className="login-popup-container">
          <div className="login-popup-title">
            <h2>Login</h2>
            <div style={{ width: 16 }} />
          </div>

          <div className="login-popup-inputs">
            <input
              name="email"
              onChange={onChange}
              value={data.email}
              type="email"
              placeholder="Your email"
              required
              disabled={loading}
            />

            {/* Password Wrapper */}
            <div className="password-input-wrapper">
              <input
                name="password"
                onChange={onChange}
                value={data.password}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                disabled={loading}
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </button>

          <div className="login-popup-condition">
            <input type="checkbox" required disabled={loading} />
            <p>By continuing, I agree to the terms of use & privacy policy.</p>
          </div>

          <p>
            New here?{" "}
            <span>
              <Link to="/signup">Create account</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
