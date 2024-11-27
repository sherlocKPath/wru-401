import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>403 - Unauthorized</h1>
      <p>คุณไม่มีสิทธิ์เข้าถึงหน้านี้</p>
      <Link to="/login">กลับไปยังหน้าเข้าสู่ระบบ</Link>
    </div>
  );
};

export default Unauthorized;
