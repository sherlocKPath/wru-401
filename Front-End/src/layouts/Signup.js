import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [idcard, setIdCard] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    if (
      !email ||
      !name ||
      !department ||
      !idcard ||
      !phonenumber ||
      !password ||
      !confirmPassword
    ) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (idcard.length !== 13 || !/^\d+$/.test(idcard)) {
      setError("กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง (13 หลัก)");
      return;
    }

    if (!/^\d{10}$/.test(phonenumber)) {
      setError("กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)");
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .post("http://localhost:50100/api/auth/signup", {
        email,
        name,
        department,
        idcard,
        phonenumber,
        password,
      })
      .then(() => {
        alert("สมัครสมาชิกสำเร็จ!");
        navigate("/login", { replace: true });
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || "สมัครสมาชิกไม่สำเร็จ");
        } else {
          setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Signup
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" paragraph>
          กรุณากรอกข้อมูลเพื่อสมัครสมาชิก
        </Typography>

        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Department"
            variant="outlined"
            fullWidth
            margin="normal"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
          <TextField
            label="ID Card Number (เลขบัตรประชาชน)"
            variant="outlined"
            fullWidth
            margin="normal"
            value={idcard}
            onChange={(e) => setIdCard(e.target.value)}
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phonenumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>

          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}
        </form>

        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Typography variant="body2" color="textSecondary" align="center">
              มีบัญชีอยู่แล้ว?{" "}
              <Link href="/login" variant="body2" color="primary">
                เข้าสู่ระบบ
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Signup;
