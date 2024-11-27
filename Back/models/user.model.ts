import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Interface สำหรับ User
export interface IUser {
  _id: string
  department: string;
  email: string;
  name: string;
  idcard: string;
  phonenumber: string;
  password: string;
  startWorkDate: Date;
  lastLogin: Date | null;
  lastLogout: Date | null;
  daywork: {
    date: Date;
    taskDetails: string;
    progressLevel: "not started" | "in progress" | "completed";
    hoursWorked: number;
  }[];
  contractEndDate: Date;
  isFeatured: boolean;
  role: "employee" | "admin";
  totalWorkDuration: string; // จากฟังชั่น virtual
  remainingContractDuration: string; // จากฟังชั่น virtual
  comparePassword(password: string): Promise<boolean>;
  extendContract(): void;
}

// Schema สำหรับข้อมูลผู้ใช้
const userSchema = new mongoose.Schema<IUser>(
  {
    department: {
      type: String,
      required: [true, "Department is required"],
      //   enum: ["HR", "IT", "Finance", "Sales", "Marketing"], // ตัวเลือกของแผนกที่อนุญาต
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "โปรดใส่อีเมลที่ถูกต้อง",
      ],
    }, // ใช้ตอน signup
    name: {
      type: String,
      required: [true, "Name is required"],
    }, // ใช้ตอน signup
    idcard: {
      type: String,
      required: [true, "ID card is required"],
      unique: true,
    },
    phonenumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
    }, // ใช้ตอน signup
    password: {
      type: String,
      required: [true, "Password is required"],
      match: [
        /^[0-9]{13}$/,
        "Password ต้องเป็นตัวเลขทั้งหมดและมีความยาว 13 ตัวอักษร",
      ],
    }, // ใช้ตอน signup
    startWorkDate: {
      type: Date,
      required: true,
      default: Date.now, // วันที่เริ่มต้นการทำงาน
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    }, // ใช้ตอน signup
    lastLogout: {
      type: Date,
      default: null, // ค่าเริ่มต้นเป็น null ถ้ายังไม่เคยออกจากระบบ
    },
    daywork: [
      //ข้อมูลการปฏิบัติงานรายวัน
      {
        date: {
          type: Date,
          required: [true, "วันที่ทำงานเป็นสิ่งที่จำเป็น"],
          // validate: {
          //   validator: async function (value: Date) {
          //     // ตรวจสอบว่ามีการบันทึกวันที่ซ้ำกันมั้ย
          //     const existing = this.daywork.find(
          //       (entry: any) =>
          //         entry.date.toISOString().split("T")[0] ===
          //         value.toISOString().split("T")[0]
          //     );
          //     if (existing && existing.hoursWorked >= 7) {
          //       throw new Error("วันนี้มีการบันทึกครบ 7 ชั่วโมงแล้ว");
          //     }
          //   },
          //   message: "ไม่สามารถเพิ่มวันปฏิบัติงานที่ซ้ำกันได้",
          // },
        },
        taskDetails: {
          type: String,
          required: [true, "รายละเอียดของงานเป็นสิ่งที่จำเป็น"],
        },
        progressLevel: {
          type: String,
          enum: ["not started", "in progress", "completed"],
          required: [true, "ระดับความคืบหน้าเป็นสิ่งที่จำเป็น"],
        },
        hoursWorked: {
          type: Number,
          required: [true, "จำนวนชั่วโมงที่ทำงานเป็นสิ่งที่จำเป็น"],
          min: [1, "จำนวนชั่วโมงขั้นต่ำ 1"],
          max: [7, "จำนวนชั่วโมงสูงสุด 7"],
        },
      },
    ],
    contractEndDate: {
      //วันครบกำหนดสัญญาจ้าง
      type: Date,
      required: true,
      default: function () {
        return new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000); // เพิ่ม 6 เดือน
      },
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
); // เพิ่ม createdAt และ updatedAt อัตโนมัติ

// คำนวณ "อายุการทำงานรวม"
userSchema.virtual("totalWorkDuration").get(function () {
  const now = new Date();
  const startWorkDate = new Date(this.startWorkDate); // แปลงเป็น Date
  const diff = now.getTime() - startWorkDate.getTime(); 
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(
    (diff % (365.25 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000)
  );
  const days = Math.floor(
    (diff % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
  );
  return `${years} ปี ${months} เดือน ${days} วัน`;
});

// คำนวณ "จำนวนวันคงเหลือที่จะครบกำหนดตามสัญญา"
userSchema.virtual("remainingContractDuration").get(function () {
  const now = new Date();
  const contractEndDate = new Date(this.contractEndDate); // แปลงเป็น Date
  const diff = contractEndDate.getTime() - now.getTime(); // ใช้สำหรับคำนวณ
  if (diff < 0) return "สัญญาหมดอายุแล้ว";
  const years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor(
    (diff % (365.25 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000)
  );
  const days = Math.floor(
    (diff % (30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000)
  );
  return `${years} ปี ${months} เดือน ${days} วัน`;
});

// ฟังก์ชันสำหรับต่ออายุสัญญาแสดงที่ admin
userSchema.methods.extendContract = function () {
  const today = new Date();
  if (today <= this.contractEndDate) {
    this.contractEndDate = new Date(
      today.getTime() + 6 * 30 * 24 * 60 * 60 * 1000
    );
  }
};

//ฟังก์ชันออัพเดทอัตโนมัติเมื่อหัวหน้าตรวจสอบ
userSchema.methods.approveWorkLog = async function (
  workLogDate: Date
): Promise<void> {
  const workLog = this.daywork.find(
    (entry: any) =>
      entry.date.toISOString().split("T")[0] ===
      workLogDate.toISOString().split("T")[0]
  );

  if (!workLog) {
    throw new Error("ไม่พบข้อมูลการปฏิบัติงานในวันที่ระบุ");
  }

  workLog.progressLevel = "completed"; // อัปเดตสถานะเป็น completed
  await this.save();
};

//ฟังก์ชันสำหรับเข้ารหัส
userSchema.pre("save", async function (next: (err?: Error) => void) {
  if (!this.isModified("password")) return next(); // ข้ามถ้า password ไม่ถูกแก้ไข

  try {
    const salt = await bcrypt.genSalt(10); // สร้าง Salt
    this.password = await bcrypt.hash(this.password, salt); // เข้ารหัส Password
    next(); 
  } catch (error) {
    next(error as Error); 
  }
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
