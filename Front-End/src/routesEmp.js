import Dashboard from "views/Dashboard.js";
import UserProfile from "views/UserProfile.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import Icons from "views/Icons.js";
import Notifications from "views/Notifications.js";
import EmployeeManagement from "views/EmployeeList";
import Dailywork from "views/Dailywork";
import Incomecalculate from "views/Incomecal";

const employeeRoutes = [
  {
    path: "/user",
    name: "User Profile",
    icon: "nc-icon nc-circle-09",
    component: UserProfile,
    layout: "/employee"
  },
  {
    path: "/dailywork",
    name: "Daily Work",
    icon: "nc-icon nc-single-copy-04",
    component: Dailywork,
    layout: "/employee"
  },
  {
    path: "/incomecalculate",
    name: "Income Calculate",
    icon: "nc-icon nc-money-coins",
    component: Incomecalculate,
    layout: "/employee"
  },
  {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: Notifications,
    layout: "/employee"
  },
  {
    path: "/typography",
    name: "Typography",
    icon: "nc-icon nc-paper-2",
    component: Typography,
    layout: "/employee"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "nc-icon nc-atom",
    component: Icons,
    layout: "/employee"
  },
];

export default employeeRoutes;
