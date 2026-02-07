// import "./Sidebar.css";
// import { assets } from "../../assets/assets";
// import {NavLink} from 'react-router'
// import { LiaPlusCircleSolid } from "react-icons/lia";
// import { IoListCircleOutline } from "react-icons/io5";
// import { RiAdminLine } from "react-icons/ri";
// import { BiBox } from "react-icons/bi";

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <div className="sidebar-options">
//         <NavLink to='/add' className="sidebar-option">
//           <LiaPlusCircleSolid className="plus" />
//           <p>Add Items</p>
//         </NavLink>
//         <NavLink to='/list' className="sidebar-option">
//           <IoListCircleOutline className="list" />
//           <p>List Items</p>
//         </NavLink>
//         <NavLink to='/orders' className="sidebar-option">
//          <BiBox className="box" />
//           <p>Orders</p>
//         </NavLink>
//         <NavLink to='' className="sidebar-option">
//          <RiAdminLine  className="adm" />
//           <p>Logout</p>
//         </NavLink>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

// src/components/Sidebar/Sidebar.jsx
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { LiaPlusCircleSolid } from "react-icons/lia";
import { IoListCircleOutline } from "react-icons/io5";
import { RiAdminLine } from "react-icons/ri";
import { BiBox } from "react-icons/bi";
import { GiShop } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";

// import { MdOutlinePointOfSale } from "react-icons/md";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink to="/dashboard" className="sidebar-option">
          <MdDashboard className="box" />
          <p>Dashboard</p>
        </NavLink>

        <NavLink to="/add" className="sidebar-option">
          <LiaPlusCircleSolid className="plus" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to="/list" className="sidebar-option">
          <IoListCircleOutline className="list" />
          <p>List Items</p>
        </NavLink>
        <NavLink to="/orders" className="sidebar-option">
          <BiBox className="box" />
          <p>Orders</p>
        </NavLink>
        {/* <a href="https://en.wikipedia.org/wiki/Point_of_sale" className="sidebar-option">
          <MdOutlinePointOfSale className="pos" />
          <p>POS</p>
        </a> */}
        {/* <a href="https://en.wikipedia.org/wiki/Point_of_sale" className="sidebar-option">
          <GiShop  className="shop" />
          <p>H.A.T</p>
        </a> */}
        <NavLink to="/logout" className="sidebar-option">
          <RiAdminLine className="adm" />
          <p>Logout</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
