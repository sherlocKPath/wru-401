import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  CssBaseline,
  Container,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import Header from "components/text/Header";
import { Card } from "react-bootstrap";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [formValues, setFormValues] = useState({
    department: "",
    email: "",
    name: "",
    idcard: "",
    phonenumber: "",
    password: "",
    // startWorkDate: null,
  });
  const [editId, setEditId] = useState(null); // Track ID for editing
  const [openDialog, setOpenDialog] = useState(false); // Control dialog visibility
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [viewEmployee, setViewEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // ใช้ withCredentials เพื่อส่ง cookies ไปด้วย
        const response = await axios.get(
          "http://localhost:50100/api/employees",
          {
            withCredentials: true, // ส่ง cookies ไปกับคำขอ
          }
        );

        setEmployees(response.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูลพนักงาน");
      }
    };

    fetchEmployees();
  }, []);

  const validateForm = () => {
    const requiredFields = [
      "department",
      "email",
      "name",
      "idcard",
      "phonenumber",
      "password",
    ];

    for (const field of requiredFields) {
      if (!formValues[field]) {
        Swal.fire("ล้มเหลว", `กรุณากรอกข้อมูลในฟิลด์: ${field}`, "error");
        setOpenDialog(false);
        return false; // หยุดการตรวจสอบทันทีที่พบข้อผิดพลาด
      }
    }
    return true; // ถ้าฟิลด์ทั้งหมดถูกต้อง
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return; // ตรวจสอบฟอร์ม

    // const preparedValues = {
    //   ...formValues,
    //   startdate: formValues.startdate
    //     ? new Date(formValues.startdate).toISOString().split("T")[0]
    //     : null,
    //   enddate: formValues.enddate
    //     ? new Date(formValues.enddate).toISOString().split("T")[0]
    //     : null,
    // };

    if (editId) {
      axios
        .put(
          `http://localhost:50100/api/employees/update/${editId}`,
          formValues,
          { withCredentials: true }
        )
        .then((res) => {
          Swal.fire("สำเร็จ", "อัปเดตข้อมูลพนักงานสำเร็จ!", "success");
          setEmployees(
            employees.map((emp) => (emp._id === editId ? res.data : emp))
          );
          setOpenDialog(false);
          resetForm();
        })
        .catch((err) => {
          Swal.fire(
            "ล้มเหลว",
            err.response?.data?.message || "เกิดข้อผิดพลาด",
            "error"
          );
          setOpenDialog(false);
        });
    } else {
      axios
        .post("http://localhost:50100/api/employees/create", formValues, {
          withCredentials: true,
        })
        .then((res) => {
          Swal.fire("สำเร็จ", "เพิ่มพนักงานเรียบร้อย!", "success");
          setEmployees([...employees, res.data]);
          setOpenDialog(false);
          resetForm();
        })
        .catch((err) => {
          Swal.fire(
            "ล้มเหลว",
            err.response?.data?.message || "เกิดข้อผิดพลาด",
            "error"
          );
          setOpenDialog(false);
        });
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "ยืนยันการลบ?",
      text: "คุณต้องการลบพนักงานนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:50100/api/employees/delete/${id}`, {
            withCredentials: true,
          })
          .then(() => {
            Swal.fire("สำเร็จ", "ลบพนักงานสำเร็จ!", "success");
            setEmployees(employees.filter((emp) => emp._id !== id));
          })
          .catch(() => {
            Swal.fire("ล้มเหลว", "ไม่สามารถลบพนักงานได้", "error");
          });
      }
    });
  };

  const handleEdit = (id) => {
    const employee = employees.find((emp) => emp._id === id);
    if (employee) {
      setFormValues({
        ...employee,
        startdate: employee.startdate ? new Date(employee.startdate) : null, // แปลง startdate เป็น Date object
      });
      setEditId(id);
      setOpenDialog(true);
    }
  };

  const handleView = (id) => {
    const employee = employees.find((emp) => emp._id === id);
    if (employee) {
      setViewEmployee(employee); // Set employee data for viewing
      setOpenViewDialog(true); // Open the view dialog
    }
  };

  const resetForm = () => {
    setFormValues({
      department: "",
      email: "",
      name: "",
      idcard: "",
      phonenumber: "",
      password: "",
      // startWorkDate: null,
    });
    setEditId(null);
  };

  const filteredEmployees = employees.filter((emp) => {
    const search = searchTerm.toLowerCase(); // ลดการแปลงซ้ำซ้อน
    return (
      (emp.name?.toLowerCase() || "").includes(search) ||
      (emp.department?.toLowerCase() || "").includes(search) ||
      (emp.email?.toLowerCase() || "").includes(search)
    );
  });

  const searchedEmployees = filteredEmployees;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
      <Box p={3}>
        <CssBaseline />
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Employee Management
          </Typography>

          <Box mb={3}>
            <Grid container spacing={2} justifyContent="space-between">
              <Grid item xs={12} sm={8} md={6}>
                <TextField
                  label="ค้นหา"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ค้นหาชื่อ, แผนก, หรืออีเมล"
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={3}
                display="flex"
                justifyContent="flex-end"
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    resetForm();
                    setOpenDialog(true);
                  }}
                >
                  เพิ่มพนักงาน
                </Button>
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            component={Paper}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    ชื่อพนักงาน
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    แผนก
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    อีเมล
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    เบอร์โทรศัพท์
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    เลขบัตรประชาชน
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    การกระทำ
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchedEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((emp) => (
                    <TableRow
                      key={emp._id}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" },
                      }}
                    >
                      <TableCell align="center">{emp.name}</TableCell>
                      <TableCell align="center">{emp.department}</TableCell>
                      <TableCell align="center">{emp.email}</TableCell>
                      <TableCell align="center">{emp.phonenumber}</TableCell>
                      <TableCell align="center">{emp.idcard}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={() => handleEdit(emp._id)}
                          aria-label="edit"
                          color="primary"
                          sx={{ marginRight: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(emp._id)}
                          aria-label="delete"
                          color="error"
                          sx={{ marginRight: 1 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleView(emp._id)}
                          color="info"
                          variant="outlined"
                        >
                          <SearchIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={searchedEmployees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Dialog for Viewing Employee Details */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)}>
        <DialogTitle>รายละเอียดพนักงาน</DialogTitle>
        <DialogContent>
          {viewEmployee && (
            <>
              <div>
                <strong>แผนก : </strong>
                {viewEmployee.department}
              </div>
              <div>
                <strong>ชื่อพนักงาน : </strong>
                {viewEmployee.name}
              </div>
              <div>
                <strong>เลขบัตรประชาชน : </strong>
                {viewEmployee.idcard}
              </div>
              <div>
                <strong>อีเมล : </strong>
                {viewEmployee.email}
              </div>
              <div>
                <strong>เบอร์โทรศัพท์ : </strong>
                {viewEmployee.phonenumber}
              </div>
              <div>
                <strong>วันที่ปฏิบัติงานวันแรก : </strong>
                {viewEmployee.startWorkDate &&
                  new Date(viewEmployee.startWorkDate).toLocaleDateString(
                    "th-TH"
                  )}
              </div>
              <div>
                <strong>วันที่ครบสัญญาจ้าง : </strong>
                {viewEmployee.contractEndDate &&
                  new Date(viewEmployee.contractEndDate).toLocaleDateString(
                    "th-TH"
                  )}
              </div>
              <div>
                <strong>ข้อมูลการปฏิบัติงานรายวัน :</strong>
                {viewEmployee.daywork && viewEmployee.daywork.length > 0 ? (
                  <ul>
                    {viewEmployee.daywork.map((work, index) => (
                      <li key={index}>
                        <p>
                          <strong>วันที่ :</strong>{" "}
                          {work.date &&
                            new Date(work.date).toLocaleDateString(
                              "th-TH"
                            )}
                        </p>
                        <p>
                          <strong>รายละเอียดงาน :</strong> {work.taskDetails}
                        </p>
                        <p>
                          <strong>ระดับความก้าวหน้า :</strong>{" "}
                          {work.progressLevel}
                        </p>
                        <p>
                          <strong>จำนวนชั่วโมงที่ทำงาน :</strong>{" "}
                          {work.hoursWorked}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  "ไม่มีข้อมูล"
                )}
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>ปิด</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding/Editing Employees */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editId ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
        </DialogTitle>
        <DialogContent>
          {Object.keys(formValues).map((key) => {
            if (key === "department") {
              return (
                <TextField
                  key={key}
                  label="แผนก"
                  value={formValues[key]}
                  onChange={(e) =>
                    setFormValues({ ...formValues, [key]: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
              );
            }

            if (key === "name") {
              return (
                <TextField
                  key={key}
                  label="ชื่อพนักงาน"
                  value={formValues[key]}
                  onChange={(e) =>
                    setFormValues({ ...formValues, [key]: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
              );
            }

            if (key === "idcard") {
              return (
                <TextField
                  label="เลขบัตรประชาชน"
                  type="text"
                  inputProps={{ maxLength: 13 }}
                  value={formValues.idcard}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setFormValues({ ...formValues, idcard: e.target.value });
                    }
                  }}
                  fullWidth
                  margin="normal"
                />
              );
            }

            if (key === "email") {
              return (
                <TextField
                  key={key}
                  label="อีเมล"
                  value={formValues[key]}
                  onChange={(e) =>
                    setFormValues({ ...formValues, [key]: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
              );
            }

            if (key === "phonenumber") {
              return (
                <TextField
                  key={key}
                  label="เบอร์โทรศัพท์"
                  type="number"
                  value={formValues[key]}
                  onChange={(e) =>
                    setFormValues({ ...formValues, [key]: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
              );
            }

            if (key === "_id" || key === "__v") {
              return (
                <TextField
                  key={key}
                  label={key}
                  value={formValues[key]}
                  fullWidth
                  margin="normal"
                  disabled
                />
              );
            }

            return (
              <TextField
                key={key}
                label={key}
                value={formValues[key]}
                onChange={(e) =>
                  setFormValues({ ...formValues, [key]: e.target.value })
                }
                fullWidth
                margin="normal"
              />
            );
          })}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            ยกเลิก
          </Button>
          <Button onClick={handleSubmit} color="primary">
            {editId ? "อัปเดต" : "เพิ่ม"}
          </Button>
        </DialogActions>
      </Dialog>
      {/* </Paper>
      </Container> */}
    </div>
  );
};

export default EmployeeManagement;
