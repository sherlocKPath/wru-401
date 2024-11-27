import { Request, Response } from "express";
import User from "../models/user.model";
// import Emp from "../models/employees.model";

// admin only
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await User.find().select(
      "-_id -password -lastLogin -lastLogout -role -createdAt -updatedAt  -__v"
    );
    res.status(200).json(employees);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getAllEmployees controller:", error.message);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    } else {
      console.log("Error in getAllEmployees controller:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An unknown error occurred",
      });
    }
  }
};

export const getFeaturedEmployees = async (req: Request, res: Response) => {
  try {
    //ดึงข้อมูลพนักงานที่มี role เป็น "employee" โดยไม่แสดงรหัสผ่าน
    const employees = await User.find({ role: "employee" }).select(
      "-_id -password -phonenumber -lastLogin -lastLogout -role -remainingContractDuration -createdAt -updatedAt -contractEndDate -daywork -idcard -__v"
    );

    // ข้อมูลที่แสดงเป็น featured
    const featuredEmployees = employees.map((employee) => ({
      name: employee.name,
      department: employee.department,
      role: employee.role,
      totalWorkDuration: employee.totalWorkDuration,
    }));
    console.log(featuredEmployees);
    res.status(200).json(featuredEmployees);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in getFeaturedEmployees:", error.message);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    } else {
      console.log("Error in getFeaturedEmployees:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An unknown error occurred",
      });
    }
  }
};

// export const createEmployees = async (req: Request, res: Response) => {
//     try {
//         const empData = new Emp(req.body);
//         const {email} = empData;

//         const empExists = await Emp.findOne({email});
//         if(empExists){
//             return res.status(400).json({ message: "พนักงานนี้มีอยู่แล้ว" });
//         }

//         const savedEmp = await empData.save();
//         res.status(200).json(savedEmp);

//     } catch (error) {

//     }
// }
export const createEmployees = async (req: Request, res: Response) => {
  try {
    const {
      department,
      email,
      name,
      idcard,
      phonenumber,
      password,
      startWorkDate,
    } = req.body;

    // Check for missing fields
    if (
      !department ||
      !name ||
      !idcard ||
      !email ||
      !phonenumber ||
      !password
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate ID card format (13-digit number)
    if (!/^\d{13}$/.test(idcard)) {
      return res
        .status(400)
        .json({ message: "ID card must be a 13-digit number" });
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone number format (10-digit number)
    if (!/^\d{10}$/.test(phonenumber)) {
      return res
        .status(400)
        .json({ message: "Phone number must be a 10-digit number" });
    }

    // Validate password format (13-digit number)
    if (!/^[0-9]{13}$/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password ต้องเป็นตัวเลขทั้งหมดและมีความยาว 13 ตัวอักษร" });
    }

    // Check if any of email, phonenumber, or idcard already exist
    const empExists = await User.findOne({
      $or: [
        { email },
        { phonenumber },
        { idcard }
      ]
    });

    if (empExists) {
      return res.status(400).json({ message: "อีเมล เบอร์โทร หรือบัตรประชาชนนี้มีอยู่แล้ว" });
    }

    // Create new user
    const user = await User.create({
      department,
      email,
      name,
      idcard,
      phonenumber,
      password,
      startWorkDate,
      role: "employee",
    });

    // Respond with the created user
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in createEmployees controller:", error.message);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    } else {
      console.log("Error in createEmployees controller:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An unknown error occurred",
      });
    }
  }
};


export const updateEmployees = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const empExist = await User.findOne({ _id: id });
    if (!empExist) {
      return res.status(404).json({ message: "ไม่พบบัญชีนี้" });
    }
    const updatedEmp = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedEmp);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteEmployees = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "พนักงานไม่มีอยู่" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "ลบพนักงานสําเร็จ" });
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in deleteEmployees controller:", error.message);
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    } else {
      console.log("Error in deleteEmployees controller:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An unknown error occurred",
      });
    }
  }
};

export const getEmployeesByDepartment = async (req: Request, res: Response) => {
  const department = req.params;
  try {
    const employees = await User.find({ department });
    res.status(200).json(employees);
  } catch (error) {
    if (error instanceof Error) {
      console.log(
        "Error in getEmployeesByDepartment controller:",
        error.message
      );
      res.status(500).json({
        error: "Internal server error",
        details: error.message,
      });
    } else {
      console.log("Error in getEmployeesByDepartment controller:", error);
      res.status(500).json({
        error: "Internal server error",
        details: "An unknown error occurred",
      });
    }
  }
};
