import { Request, Response } from "express";
import User from "../models/user.model";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export const signup = async (req: Request, res: Response) => {
  const { email, name, department, idcard, phonenumber, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    console.log("userExists", userExists);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
      email,
      name,
      department,
      idcard,
      phonenumber,
      password,
    });

    generateTokenAndSetCookie(res, user._id.toString());
    console.log(user);

    res.status(201).json({ 
      user,
      role: user.role, 
      message: "User created successfully" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      res
        .status(400)
        .json({ success: false, message: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await User.findOne({ email });

    // ตรวจสอบว่าผู้ใช้และรหัสผ่านถูกต้อง
    if (user && (await user.comparePassword(password))) {
      // สร้าง token และตั้งค่าใน cookie
      const token = generateTokenAndSetCookie(res, user._id.toString());

      // ส่งข้อมูลผู้ใช้และ token กลับไป
      res.status(200).json({
        token,
        role: user.role, // ส่ง role ของผู้ใช้เพื่อให้ client ทราบ
        message: "เข้าสู่ระบบสำเร็จ",
      });
    } else {
      // ถ้าผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
      res.status(400).json({ message: "ข้อมูลไม่ถูกต้อง" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "ออกจากระบบสําเร็จ" });
};