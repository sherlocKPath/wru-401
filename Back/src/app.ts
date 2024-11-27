import express, { Request, Response } from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import cookieParser from "cookie-parser";

import authRoutes from "../routes/auth.route";
import employeeRoutes from "../routes/employee.route";
import worklogRoutes from "../routes/worklog.route";
import { connectDB } from "../db/connectDB";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// แก้ไข CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// แก้ไข Helmet
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false,
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/worklog", worklogRoutes);

// Error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: "Something went wrong!",
//     error: err.message,
//   });
// });

// // 404 Handler
// app.use((req, res, next) => {
//   res.status(404).json({
//     success: false,
//     message: "API route not found",
//   });
// });

// Connect to database
const PORT = process.env.PORT || 50100;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on port ${PORT}`);
});
