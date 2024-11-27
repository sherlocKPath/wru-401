import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Login from "layouts/Login";
import AdminLayout from "layouts/Admin";
import Dashboard from "views/Dashboard";
import EmployeeManagement from "views/EmployeeList";
import Dailywork from "views/Dailywork";
import User from "views/UserProfile";
import Incomecalculate from "views/Incomecal";
import Notifications from "views/Notifications";
import Typography from "views/Typography";
import Icons from "views/Icons";
import Unauthorized from "views/Unauthorized";
import Employee from "layouts/Employee";
import PrivateRoute from "components/PrivateRoute/PrivateRoute";
import Signup from "layouts/Signup";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      {/* Redirect "*" ไป "/login" */}
      <Route path="*" element={<Navigate to="/login" replace />} />

      {/* หน้า Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Layout */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="user" element={<User />} />
          <Route path="employee" element={<EmployeeManagement />} />
          <Route path="dailywork" element={<Dailywork />} />
          <Route path="incomecalculate" element={<Incomecalculate />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="typography" element={<Typography />} />
          <Route path="icons" element={<Icons />} />
        </Route>
      </Route>

      {/* Employee Layout */}
      <Route element={<PrivateRoute allowedRoles={['employee']} />}>
        <Route path="/employee/*" element={<Employee />}>
          <Route path="user" element={<User />} />
          <Route path="dailywork" element={<Dailywork />} />
          <Route path="incomecalculate" element={<Incomecalculate />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="typography" element={<Typography />} />
          <Route path="icons" element={<Icons />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
