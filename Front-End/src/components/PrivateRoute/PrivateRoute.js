import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Mock ตัวอย่างการตรวจสอบ role และ token
const getAuth = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // admin หรือ employee
  return { token, role };
};

const PrivateRoute = ({ allowedRoles }) => {
  const { token, role } = getAuth();

  if (!token) {
    // ถ้าไม่มี token ส่งไปหน้า Login
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // ถ้า role ไม่ตรงกับ allowedRoles ส่งไป Unauthorized
    return <Navigate to="/unauthorized" replace />;
  }

  // ถ้า token และ role ถูกต้อง Render เนื้อหาของเส้นทางนี้
  return <Outlet />;
};

export default PrivateRoute;
