import React, { useState, useEffect, useRef } from "react";
import { useLocation, Routes, Route, Outlet } from "react-router-dom";
import AdminNavbar from "components/Navbars/AdminNavbar";
import Footer from "components/Footer/Footer";
import Sidebar from "components/Sidebar/Sidebar";
import employeeRoutes from "routesEmp";

import sidebarImage from "assets/img/sidebar-3.jpg";

function Employee() {
  const [image, setImage] = useState(sidebarImage);
  const [color, setColor] = useState("black");
  const [hasImage, setHasImage] = useState(true);
  const location = useLocation();
  const mainPanel = useRef(null);

  // ฟังก์ชันสำหรับสร้าง Routes
  const getRoutes = (routesEmp) => {
    return routesEmp.map((prop, key) => {
      if (prop.layout === "/employee") {
        const Component = prop.component; // ดึง component ออกมาใช้งาน
        return <Route path={prop.path} element={<Component />} key={key} />;
      }
      return null; // หาก layout ไม่ตรง ให้คืนค่า null
    });
  };

  // รีเซ็ต Scroll เมื่อเปลี่ยนหน้า
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;

    // ปิด Sidebar menu บนจอขนาดเล็ก
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
      <Sidebar color={color} image={hasImage ? image : ""} routes={employeeRoutes} />
      <div className="main-panel" ref={mainPanel}>
        <AdminNavbar />
        <div className="content">
          <Routes>
            {getRoutes(employeeRoutes)} {/* Render routes */}
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Employee;
