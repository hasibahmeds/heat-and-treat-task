import { assets } from "../../assets/assets";
import "./Footer.css";
import { MdOutgoingMail } from "react-icons/md";
import { GrMapLocation } from "react-icons/gr";
import { FaFacebookF, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  const openEmail = (e) => {
    e.preventDefault();
    const email = "tastecode.1525@gmail.com";

    // Check if user is on Mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `mailto:${email}`;
    } else {
      // Open Gmail Web in new tab for Desktop
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
        "_blank"
      );
    }
  };

  return (
    <div className="footer" id="footer">
      <hr />
      <div className="footer-content">
        {/* Left - Logo & Description */}
        <div className="footer-content-left">
          <a href="#top">
            <img
              src={assets.logo_hat}
              className="logo"
              alt="Heat & Treat Logo"
            />
          </a>
          <p>
            Experience The Perfect Blend of Bold Flavors & Fiery Passion. Made
            Fresh, Served Hot — The Ultimate Destination For Heat That Treats!
          </p>
          <div className="footer-social-icons">
            <a
              className="fb"
              href="https://www.facebook.com/people/%F0%9D%99%83%F0%9D%99%80%F0%9D%98%BC%F0%9D%99%8F-%F0%9D%98%BC%F0%9D%99%89%F0%9D%98%BF-%F0%9D%99%8F%F0%9D%99%8D%F0%9D%99%80%F0%9D%98%BC%F0%9D%99%8F/61581888510141/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF />
            </a>
            <a
              className="loc"
              href="https://maps.app.goo.gl/5Urheg8tL1xRVCpY9"
              target="_blank"
              rel="noopener noreferrer"
            >
              <GrMapLocation />
            </a>
          </div>
        </div>

        {/* Center - Quick Links */}
        <div className="footer-content-center">
          <h2>Quick Links</h2>
          <ul>
            <li id="top">
              <a href="#top">Home</a>
            </li>
            <li id="explore-menu">
              <a href="#explore-menu">Menu</a>
            </li>
            <li id="footer">
              <a href="#footer">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Right - Contact Info */}
        <div className="footer-content-right">
          <h2>Contact Us</h2>
          <ul>
            {/* <li>
              <MdOutgoingMail className="icon gmail" />
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=tastecode.1525@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                tastecode.1525@gmail.com
              </a>
            </li> */}
            <li>
              <MdOutgoingMail className="icon gmail" />
              <a href="#" onClick={openEmail}>
                tastecode.1525@gmail.com
              </a>
            </li>
            <li>
              <FaPhoneAlt className="icon phone" />
              <a href="tel:+8801635646047">+880 1635-646047</a>
            </li>
            <li>
              <FaPhoneAlt className="icon phone" />
              <a href="tel:+8801760623769">+880 1760-623769</a>
            </li>
            {/* <li>
              <FaPhoneAlt className="icon whatsapp" />
              <a
                href="https://wa.me/8801760623769"
                target="_blank"
                rel="noopener noreferrer"
              >
                +880 1760-623769
              </a>
            </li> */}
          </ul>
        </div>
      </div>

      <hr />

      <p className="footer-copyright">
        Copyright © 2025 <strong>Heat & Treat</strong> - All Rights Reserved |
        <span className="made-with">
          {" "}
          <strong>Made With Fire & Coffee</strong>
        </span>
      </p>
    </div>
  );
};

export default Footer;
