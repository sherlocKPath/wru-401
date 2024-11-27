import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";

// ขยาย Request interface
declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // ทำ userId ให้เป็น optional property
    user : IUser;
  }
}

export const protectRoute = async ( req: Request,res: Response, next: NextFunction) =>{
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ success: false, message: "กรุณาเข้าสู่ระบบ" });
    return;
  }

  try {
    const decoded = jwt.verify( token, process.env.JWT_SECRET as string ) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "ไม่พบบัญชีผู้ใช้" });
    }

    req.user = user;
    
    next();
  } catch (error) {
    console.error("Error in verifyToken", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const adminRoute = (req: Request, res: Response, next: NextFunction) => {
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        return res.status(403).json({ message: "ไม่มีสิทธิ์เข้าถึงสำหรับ admin เท่านั้น" });
    }
}

// export const checkAuth = async (req: Request, res: Response) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");
    

//     if (!user) {
//       return res
//         .status(400)
//         .json({ success: false, message: "ไม่พบบัญชีผู้ใช้" });
//     }

//     res.status(200).json({ success: true, user });
//   } catch (error) {
//     console.log("Error in checkAuth", error);
//     if (error instanceof Error) {
//       res.status(400).json({ success: false, message: error.message });
//     } else {
//       res
//         .status(400)
//         .json({ success: false, message: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ" });
//     }
//   }
// };