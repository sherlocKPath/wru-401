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
  Box,
  IconButton,
} from "@mui/material";
import { Facebook, Twitter, Google } from "@mui/icons-material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .post(
        "http://localhost:50100/api/auth/login",
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        const { token, role } = res.data || {};

        if (token && role) {
          localStorage.setItem("token", token);
          localStorage.setItem("role", role);

          if (role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else if (role === "employee") {
            navigate("/employee/user", { replace: true });
          } else {
            setError("บทบาทไม่ถูกต้อง");
          }
        } else {
          setError("ไม่พบข้อมูล token หรือ role ในการตอบกลับจากเซิร์ฟเวอร์");
        }
      })
      .catch((error) => {
        if (error.response) {
          setError(error.response.data.message || "เข้าสู่ระบบไม่สำเร็จ");
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
        height: "100vh", // Full screen height
        display: "flex", // Flexbox for centering
        alignItems: "center", // Vertically center
        justifyContent: "center", // Horizontally center
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%", // Full width of the Container
          maxWidth: 400, // Limit the max width for a cleaner look
        }}
      >
        <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
          Login
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center" paragraph>
          กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
        </Typography>

        <form onSubmit={handleLogin} style={{ width: "100%" }}>
          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
          </Button>

          {error && (
            <Typography color="error" variant="body2" align="center" sx={{ marginTop: 2 }}>
              {error}
            </Typography>
          )}

          <Grid container justifyContent="flex-end" sx={{ marginTop: 1 }}>
            <Grid item>
              <Link href="#" variant="body2" color="primary">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>

        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <IconButton color="primary" sx={{ marginX: 1 }}>
            <Facebook />
          </IconButton>
          <IconButton color="primary" sx={{ marginX: 1 }}>
            <Twitter />
          </IconButton>
          <IconButton color="primary" sx={{ marginX: 1 }}>
            <Google />
          </IconButton>
        </Box>

        <Grid container justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item>
            <Typography variant="body2" color="textSecondary" align="center">
              ยังไม่มีบัญชี?{" "}
              <Link href="/signup" variant="body2" color="primary">
                สมัครสมาชิก
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Login;
