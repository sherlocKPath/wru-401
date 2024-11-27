import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Notifications from "views/Notifications.js";
import EmployeeManagement from "views/EmployeeList";
import Dailywork from "views/Dailywork";
import Incomecalculate from "views/Incomecal";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/admin"
  },
  {
    path: "/employee",
    name: "Employee List",
    icon: "nc-icon nc-notes",
    component: EmployeeManagement,
    layout: "/admin"
  },
  {
    path: "/dailywork",
    name: "Daily Work",
    icon: "nc-icon nc-single-copy-04",
    component: Dailywork,
    layout: "/admin"
  },
  {
    path: "/incomecalculate",
    name: "Income Calculate",
    icon: "nc-icon nc-money-coins",
    component: Incomecalculate,
    layout: "/admin"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/admin"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/admin"
  },
];

export default dashboardRoutes;
