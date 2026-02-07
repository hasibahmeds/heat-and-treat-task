// src/pages/Auth/Logout.jsx
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const go = async () => {
      await signOut(auth);
      navigate("/login", { replace: true });
    };
    go();
  }, [navigate]);
  return null;
};

export default Logout;