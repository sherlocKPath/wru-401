import React from "react";
import { useLocation, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";

function Sidebar({ color, image, routes }) {
  const location = useLocation();

  // ตรวจสอบเส้นทางปัจจุบัน
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  return (
    <div className="sidebar" data-image={image} data-color={color}>
      <div
        className="sidebar-background"
        // style={{
        //   backgroundImage: image ? `url(${image})` : "none",
        // }}
      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a className="simple-text logo-mini mx-1">
            <div className="logo-img">
              <img src={require("assets/img/reactlogo.png")} alt="logo" />
            </div>
          </a>
          <a className="simple-text">WE ARE YOU (W.R.U)</a>
        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect) {
              return (
                <li
                  className={prop.upgrade ? "active active-pro" : activeRoute(prop.layout + prop.path)}
                  key={key} // เพิ่ม key ที่ไม่ซ้ำ
                >
                  <NavLink
                    to={prop.layout + prop.path}
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} // ใช้ className แทน activeClassName
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            }
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
