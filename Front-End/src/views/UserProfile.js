import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Form, Container, Row, Col } from "react-bootstrap";
import { id } from "date-fns/locale";

const User = () => {
  const [employee, setEmployee] = useState({
    name: "",
    idcard: "",
    email: "",
    department: "",
    phonenumber: "",
    startWorkDate: "",
    contractEndDate: "",
    totalWorkDuration: "",
    remainingContractDuration: "",
    daywork:[{
      date: "",
      taskDetails: "",
      progressLevel: "",
      hoursWorked: "",
    }]
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    // ดึงข้อมูลโปรไฟล์ของพนักงาน
    axios
      .get("http://localhost:50100/api/employees/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true, // ถ้าคุณต้องการส่ง cookie
      })
      .then((res) => {
        setEmployee(res.data); // ตั้งค่าข้อมูลพนักงานที่ได้จาก API
        setIsLoading(false); // หยุดการโหลดเมื่อดึงข้อมูลเสร็จ
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        setError("ไม่สามารถดึงข้อมูลโปรไฟล์ได้");
        setIsLoading(false);
      });
  }, [token]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <Container fluid>
      <Row>
        <Col md="8">
          <Card>
            <Card.Header>
              <Card.Title as="h4">ข้อมูลพนักงาน</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <label>ชื่อ - นามสกุล</label>
                      <Form.Control
                        value={employee.name}
                        placeholder="ชื่อ - นามสกุล"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <label>เลขบัตรประชาชน</label>
                      <Form.Control
                        value={employee.idcard}
                        placeholder="เลขบัตรประชาชน"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <label>อีเมล</label>
                      <Form.Control
                        value={employee.email}
                        placeholder="แผนกที่สังกัด"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <label>เบอร์โทรศัพท์</label>
                      <Form.Control
                        value={employee.phonenumber}
                        placeholder="แผนกที่สังกัด"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <label>แผนกที่สังกัด</label>
                      <Form.Control
                        value={employee.department}
                        placeholder="แผนกที่สังกัด"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <label>วันที่เริ่มทำงาน</label>
                      <Form.Control
                        value={
                          employee.startWorkDate &&
                          new Date(employee.startWorkDate).toLocaleDateString(
                            "th-TH"
                          )
                        }
                        placeholder="วันที่เริ่มงาน"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <label>วันที่ครบสัญญาจ้าง</label>
                      <Form.Control
                        value={employee.contractEndDate &&
                          new Date(employee.contractEndDate).toLocaleDateString(
                            "th-TH"
                          )}
                        placeholder="วันที่ครบสัญญาจ้าง"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                    <Form.Group>
                      <label>อายุการทำงานรวม</label>
                      <Form.Control
                        value={employee.totalWorkDuration}
                        placeholder="อายุการทำงานรวม"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <label>จำนวนวันคงเหลือ</label>
                      <Form.Control
                        value={employee.remainingContractDuration}
                        placeholder="จำนวนวันคงเหลือ"
                        type="text"
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md="6">
                  <label>การปฏิบัติงานรายวัน</label>
                  {employee.daywork.map((daywork, index) => (
                    <div key={index}>
                      <Form.Control
                        value={employee.daywork[index].taskDetails}
                        placeholder="การปฏิบัติงานรายวัน"
                        type="text"
                        readOnly
                      />
                    </div>
                  ))}
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default User;
