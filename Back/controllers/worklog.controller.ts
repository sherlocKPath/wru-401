import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";

// เพิ่มคำอธิบาย Request interface สำหรับ Express
declare module "express-serve-static-core" {
  interface Request {
    userId?: string; // ทำ userId ให้เป็น optional property
    user: IUser;
  }
}

export const addWorkLog = async (req: Request, res: Response) => {
  try {
    const { date, taskDetails, progressLevel, hoursWorked } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!date || !taskDetails || !progressLevel || hoursWorked === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // แปลง hoursWorked ให้เป็น number
    const parsedHoursWorked = Number(hoursWorked);
    if (isNaN(parsedHoursWorked)) {
      return res.status(400).json({ message: "ชั่วโมงการทำงานต้องเป็นตัวเลข" });
    }

    // ตรวจสอบข้อมูลใน daywork
    const workLogDate = new Date(date);
    const existingWorkLog = user.daywork.find((entry: any) => {
      const entryDate = new Date(entry.date);
      return (
        entryDate.toISOString().split("T")[0] ===
        workLogDate.toISOString().split("T")[0]
      );
    });

    if (existingWorkLog) {
      const totalHours = existingWorkLog.hoursWorked + parsedHoursWorked;

      if (totalHours > 7) {
        return res.status(400).json({
          message: `ชั่วโมงการทำงานเกินที่กำหนดต่อวัน (รวมแล้ว ${totalHours} ชั่วโมง). ไม่สามารถบันทึกได้`,
        });
      }

      existingWorkLog.hoursWorked += parsedHoursWorked;
      existingWorkLog.taskDetails += `\n${taskDetails}`;
      existingWorkLog.progressLevel = progressLevel;
    } else {
      if (parsedHoursWorked > 7) {
        return res.status(400).json({
          message: "ชั่วโมงการทำงานเกินที่กำหนดต่อวัน ไม่สามารถบันทึกได้",
        });
      }

      user.daywork.push({
        date: workLogDate,
        taskDetails,
        progressLevel,
        hoursWorked: parsedHoursWorked,
      });
    }

    await (user as any).save();
    return res.status(200).json({ message: "Work log added successfully" });
  } catch (error) {
    console.error("Error adding work log:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const getWorkLog = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the work log data to include only relevant fields
    const formattedWorkLogs = user.daywork.map((workLog: any) => ({
      date: workLog.date.toISOString().split("T")[0], // Format date to YYYY-MM-DD
      taskDetails: workLog.taskDetails,
      progressLevel: workLog.progressLevel,
      hoursWorked: workLog.hoursWorked,
    }));

    return res.status(200).json(formattedWorkLogs);
  } catch (error) {
    console.error("Error fetching work logs:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const updateWorkLog = async (req: Request, res: Response) => {
  try {
    const { date, taskDetails, progressLevel, hoursWorked } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!date || hoursWorked === undefined) {
      return res
        .status(400)
        .json({ message: "Date and hoursWorked are required" });
    }

    const workLogDate = new Date(date);
    const existingWorkLog = user.daywork.find(
      (entry: any) =>
        entry.date.toISOString().split("T")[0] ===
        workLogDate.toISOString().split("T")[0]
    );

    if (!existingWorkLog) {
      return res
        .status(404)
        .json({ message: "Work log not found for the given date" });
    }

    // Update fields only if they are provided in the request body
    if (taskDetails) existingWorkLog.taskDetails = taskDetails;
    if (progressLevel) existingWorkLog.progressLevel = progressLevel;
    if (hoursWorked !== undefined) existingWorkLog.hoursWorked = hoursWorked;

    await (user as any).save();

    return res.status(200).json({ message: "Work log updated successfully" });
  } catch (error) {
    console.error("Error updating work log:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

export const deleteWorkLog = async (req: Request, res: Response) => {
  try {
    const { date } = req.body;
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const workLogDate = new Date(date);
    const workLogIndex = user.daywork.findIndex(
      (entry: any) =>
        entry.date.toISOString().split("T")[0] ===
        workLogDate.toISOString().split("T")[0]
    );

    if (workLogIndex === -1) {
      return res
        .status(404)
        .json({ message: "Work log not found for the given date" });
    }

    // Remove the work log from the array
    user.daywork.splice(workLogIndex, 1);

    await (user as any).save();

    return res.status(200).json({ message: "Work log deleted successfully" });
  } catch (error) {
    console.error("Error deleting work log:", error);

    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};
