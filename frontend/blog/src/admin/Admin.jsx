import React, { useEffect, useState } from "react";
import { Table, Button, Container } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Accordion from 'react-bootstrap/Accordion';
import Adminquery from './adminquery'
import Admincarousel from "./admincarousel";
import AdminBlog from "./AdminBlog";
const Admin = () => {
  const [users, setUsers] = useState([]);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("Token");
        const response = await axios.get("http://localhost:5000/getUsers" , {
          headers : {Authorization: `Bearer ${token}`},
        });
        
        setUsers(response.data);
      } catch (error) {
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);








  const makeAdmin = async (userId) => {
    const token = localStorage.getItem("Token")
    try {
      await axios.patch(`http://localhost:5000/makeAdmin/${userId}` , {} , {
        headers : { Authorization : `Bearer ${token}`}
      });
      toast.success("user is now admin");
      // fetchUsers();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: true } : user
        )
      );
    }
    catch (error) {
      toast.error("cannot make user admin")
    }
  };

  const removeAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("Token");
      await axios.patch(`http://localhost:5000/removeAdmin/${userId}` , {} ,{
        headers : {Authorization : `Bearer ${token}`}
      });
      toast.success("Admin privileges removed");
      // fetchUsers();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isAdmin: false } : user
        )
      );
    } catch (error) {
      toast.error("Failed to remove admin.");
    }
  };

  const handleDelete = async (userId) => {
    const token = localStorage.getItem("Token");
    try {
      await axios.delete(`http://localhost:5000/deleteUser/${userId}` , {
        headers : {Authorization : `Bearer ${token}`}
      });
      toast.success("user deleted successfully");
      setUsers(users.filter((user) => user._id !== userId));
    }
    catch (error) {
      toast.error("Failed to delete user.");
    }
  }




  return (
    <>

      <Accordion defaultActiveKey="">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Manage Users</Accordion.Header>
          <Accordion.Body>
            <Container className="mt-4">
              <h2 className="text-center mb-3">User Management</h2>
              <Table striped bordered hover responsive>
                <thead className="table-dark">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Gender</th>
                    <th>Admin</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.gender}</td>
                        <td>{user.isAdmin ? "✅ Yes" : "❌ No"}</td>
                        <td>
                          {user.isAdmin ? (
                            <Button
                              variant="warning"
                              size="sm"
                              className="me-2"
                              onClick={() => removeAdmin(user._id)}
                            >
                              Remove Admin
                            </Button>
                          ) : (
                            <Button
                              variant="success"
                              size="sm"
                              className="me-2"
                              onClick={() => makeAdmin(user._id)}
                            >
                              Make Admin
                            </Button>
                          )}
                          <Button variant="danger" size="sm" onClick={() => handleDelete(user._id)}>
                            Delete
                          </Button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Container>
          </Accordion.Body>
        </Accordion.Item>




        
        <Accordion.Item eventKey="1">
          <Accordion.Header>Manage All Blogs</Accordion.Header>
          <Accordion.Body>





            <AdminBlog />






          </Accordion.Body>








        </Accordion.Item>
        <Accordion.Item eventKey="2">
          <Accordion.Header>Manage Carousel</Accordion.Header>
          <Accordion.Body>
            <Container className="mt-4">



              <Admincarousel />


            </Container>
          </Accordion.Body>
        </Accordion.Item>




        <Accordion.Item eventKey="3">
          <Accordion.Header>Manage Query</Accordion.Header>
          <Accordion.Body>
            <Adminquery />
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>



    </>
  )
}

export default Admin