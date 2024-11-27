import React, { useState, useEffect, useRef } from "react";
import { useLocation, Routes, Route, Outlet } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js"; // ตรวจสอบให้แน่ใจว่า routes.js มีการ export routes

import sidebarImage from "assets/img/sidebar-3.jpg";

function Admin() {
  const [image, setImage] = useState(sidebarImage);
  const [color, setColor] = useState("black");
  const [hasImage, setHasImage] = useState(true);
  const location = useLocation();
  const mainPanel = useRef(null);

  // กรอง routes และส่ง route ที่ตรงกับ layout "/admin"
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            element={<prop.component />}
            key={key}
          />
        );
      }
      return null; // แสดง null ถ้า layout ไม่ตรง
    });
  };

  // ฟังก์ชันนี้จะถูกเรียกเมื่อ location เปลี่ยน
  useEffect(() => {
    // ล้าง scroll เมื่อหน้าเปลี่ยน
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;

    // ปิด menu ถ้าจอมีขนาดเล็กกว่า 993px
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      const element = document.getElementById("bodyClick");
      if (element) element.parentNode.removeChild(element);
    }
  }, [location]);

  return (
    <div className="wrapper">
      <Sidebar color={color} image={hasImage ? image : ""} routes={routes} />
      <div className="main-panel" ref={mainPanel}>
        <AdminNavbar />
        <div className="content">
          <Outlet />
          <Routes>{getRoutes(routes)}</Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Admin;
