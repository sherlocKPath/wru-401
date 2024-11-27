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
  Typography,
  TablePagination,
} from "@mui/material";

const Dailywork = () => {
  const [dailyworks, setDailyworks] = useState([]);
  const [formValues, setFormValues] = useState({
    date: "",
    taskDetails: "",
    progressLevel: "",
    hoursWorked: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Fetch daily works from back-end
  const fetchDailyworks = async () => {
    try {
      const res = await axios.get("http://localhost:50100/api/worklog", {
        withCredentials: true,
      });
      setDailyworks(res.data);
    } catch (error) {
      console.error("Error fetching daily works:", error);
      Swal.fire("ล้มเหลว", "ไม่สามารถโหลดข้อมูลได้", "error");
    }
  };

  useEffect(() => {
    fetchDailyworks();
  }, []);

  const validateForm = () => {
    const { date, taskDetails, progressLevel, hoursWorked } = formValues;
    if (!date || !taskDetails || !progressLevel || !hoursWorked) {
      Swal.fire("ล้มเหลว", "กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
      setOpenDialog(false);
      return false;
    }
    if (Number(hoursWorked) > 7) {
      Swal.fire(
        "ล้มเหลว",
        "จำนวนชั่วโมงการทำงานต้องไม่เกิน 7 ชั่วโมง",
        "error"
      );
      setOpenDialog(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const preparedValues = {
      ...formValues,
      date: formValues.date
        ? new Date(formValues.date).toISOString().split("T")[0]
        : null,
    };

    try {
      await axios.post(
        "http://localhost:50100/api/worklog/addwork",
        preparedValues,
        {
          withCredentials: true,
        }
      );
      Swal.fire("สำเร็จ", "เพิ่มข้อมูลสำเร็จ!", "success");
      fetchDailyworks(); // Refresh data from server
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      Swal.fire(
        "ล้มเหลว",
        err.response?.data?.message || "เกิดข้อผิดพลาด",
        "error"
      );
      setOpenDialog(false);
    }
  };

  const resetForm = () => {
    setFormValues({
      date: "",
      taskDetails: "",
      progressLevel: "",
      hoursWorked: "",
    });
  };

  const filteredDailyworks = dailyworks.filter((work) => {
    const searchString = Object.values(work || {})
      .join(" ")
      .toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box p={3}>
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          บันทึกการทำงานรายวัน
        </Typography>
        <Box mb={3}>
          <Grid container spacing={2} justifyContent="space-between">
            <Grid item xs={12} sm={8}>
              <TextField
                label="ค้นหา"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาข้อมูล"
              />
            </Grid>
            <Grid item xs={12} sm={4} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  resetForm();
                  setOpenDialog(true);
                }}
              >
                เพิ่มข้อมูล
              </Button>
            </Grid>
          </Grid>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">วันที่ทำงาน</TableCell>
                <TableCell align="center">รายละเอียด</TableCell>
                <TableCell align="center">ความคืบหน้า</TableCell>
                <TableCell align="center">ชั่วโมง</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDailyworks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((work, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      {work.date &&
                        new Date(work.date).toISOString().split("T")[0]}
                    </TableCell>
                    <TableCell align="center">{work.taskDetails}</TableCell>
                    <TableCell align="center">{work.progressLevel}</TableCell>
                    <TableCell align="center">{work.hoursWorked}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredDailyworks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>เพิ่มข้อมูลใหม่</DialogTitle>
        <DialogContent>
          <TextField
            label=""
            type="date"
            value={formValues.date}
            onChange={(e) =>
              setFormValues({ ...formValues, date: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="รายละเอียดงาน"
            value={formValues.taskDetails}
            onChange={(e) =>
              setFormValues({ ...formValues, taskDetails: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          {/* ช่อง Select สำหรับ Progress Level */}
          <TextField
            label=""
            select
            value={formValues.progressLevel}
            onChange={(e) =>
              setFormValues({ ...formValues, progressLevel: e.target.value })
            }
            fullWidth
            margin="normal"
            SelectProps={{
              native: true, // ใช้ native select dropdown
            }}
          >
            <option value="" disabled>
              เลือกสถานะ
            </option>
            <option value="not started">ยังไม่ได้เริ่ม</option>
            <option value="in progress">กำลังดำเนินการ</option>
            <option value="completed">เสร็จสิ้น</option>
          </TextField>
          <TextField
            label="จำนวนชั่วโมง"
            type="number"
            value={formValues.hoursWorked}
            onChange={(e) =>
              setFormValues({ ...formValues, hoursWorked: e.target.value })
            }
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dailywork;
