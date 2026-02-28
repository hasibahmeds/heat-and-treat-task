import './Navbar.css'
import { assets } from '../../assets/assets'
import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import { CgClose, CgProfile } from "react-icons/cg"
import { FaBasketShopping } from "react-icons/fa6"
import { BsBagCheck } from "react-icons/bs"
import { RiLogoutBoxRLine, RiMenu3Line } from "react-icons/ri"
import { TfiHome } from "react-icons/tfi"
import { RiMenuAddLine } from "react-icons/ri"
import { GrContact } from "react-icons/gr"

const Navbar = ({ setShowLogin }) => {
  const navigate = useNavigate()
  const [menu, setMenu] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalCartAmount, token, setToken, userEmail } = useContext(StoreContext)

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("userEmail")
    setToken("")
    navigate("/")
    setMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  // Helper function to go home + scroll to top
  const goToHome = () => {
    setMenu("home")
    closeMobileMenu()
    navigate('/')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="navbar" id="top">
      {/* Logo - now also scrolls to top when already on home */}
      <div onClick={goToHome} style={{ cursor: 'pointer' }}>
        <img src={assets.logo_hat} alt="Logo" className="logo" />
      </div>

      {/* Desktop Menu */}
      <ul className="navbar-menu">
        <Link 
          to="/" 
          onClick={() => {
            setMenu("home")
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }} 
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>

        {window.location.pathname === "/" ? (
          <a 
            href="#explore-menu" 
            onClick={() => setMenu("menu")} 
            className={menu === "menu" ? "active" : ""}
          >
            Menu
          </a>
        ) : (
          <Link 
            to="/#explore-menu" 
            onClick={() => setMenu("menu")} 
            className={menu === "menu" ? "active" : ""}
          >
            Menu
          </Link>
        )}

        <a 
          href="#footer" 
          onClick={() => setMenu("contact-us")} 
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>

      {/* Right side - cart + profile + mobile toggle */}
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/cart" onClick={closeMobileMenu}>
            <FaBasketShopping className="bask" />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>

        {!token ? (
          <button 
            className="navbar-signin-desktop" 
            onClick={() => setShowLogin(true)}
          >
            Sign In
          </button>
        ) : (
          <div className="navbar-profile navbar-profile-desktop">
            <CgProfile className="prof" />
            <ul className="nav-profile-dropdown">
              <li className="profile-email-li">
                <p className="profile-email">{userEmail}</p>
              </li>
              <hr />
              <li onClick={() => { navigate('/myorders'); closeMobileMenu(); }}>
                <BsBagCheck className="shopp" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <RiLogoutBoxRLine className="logoutt" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}

        <div className="navbar-mobile-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <CgClose size={25} /> : <RiMenu3Line size={25} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className='for-mmenu-home' onClick={goToHome}>
          <TfiHome className='mob' /> Home
        </div>

        {window.location.pathname === "/" ? (
          <a 
            href="#explore-menu" 
            onClick={() => { setMenu("menu"); closeMobileMenu(); }}
          >
            <RiMenuAddLine className='mob' /> Menu
          </a>
        ) : (
          <Link 
            to="/#explore-menu" 
            onClick={() => { setMenu("menu"); closeMobileMenu(); }}
          >
            <RiMenuAddLine className='mob' /> Menu
          </Link>
        )}

        <a 
          href="#footer" 
          onClick={() => { setMenu("contact-us"); closeMobileMenu(); }}
        >
          <GrContact className='mob' /> Contact Us
        </a>

        {!token ? (
          <button 
            onClick={() => { setShowLogin(true); closeMobileMenu(); }}
          >
            Sign In
          </button>
        ) : (
          <>
            <div className="mobile-menu-email">
              Logged in as <strong>{userEmail}</strong>
            </div>
            <Link 
              to="/myorders" 
              onClick={closeMobileMenu} 
              className="mobile-menu-orders"
            >
              <BsBagCheck className='mob' /> Orders
            </Link>
            <div 
              onClick={logout} 
              className="mobile-menu-logout"
            >
              <RiLogoutBoxRLine className='mob' /> Logout
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Navbar