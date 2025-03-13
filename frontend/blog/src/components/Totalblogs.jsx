import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Card, Row, Col, Button ,Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from './footer';
import AOS from "aos";
import "aos/dist/aos.css";

AOS.init();

const Totalblogs = () => {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
  
    useEffect(() => {
      fetchAllBlogs();
    }, []);
  
    const filteredBlogs = blogs.filter((blog) =>
      `${blog.title} ${blog.description} ${blog.tags.join(" ")}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const fetchAllBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allBlogs");
        setBlogs(response.data);
      } catch (error) {
        toast.error("Failed to fetch blogs.");
        console.error("Failed to fetch blogs!", error);
      }
    };
    
    
  return (
    <>
  <Container className="mt-4">
  <Form.Control
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
           <Row>
           {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
                 <Col  xl={3} sm={6} md={4}  key={blog._id} className="mb-4">
                   <Card className="cardbg"   style={{
      background: "rgba(255, 255, 255, 0.2)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      borderRadius: "15px",
      border: "1px solid rgba(255, 255, 255, 0.3)"
    }}  data-aos="zoom-in-up">
                     <Card.Img variant="top" src={blog.image} alt={blog.title} style={{ height: "200px", objectFit: "cover" }} />
                     <Card.Body>
                       <Card.Title className="text-light">{blog.title}</Card.Title>
                       <Card.Text  className="text-light">{blog.description.substring(0, 100)}...</Card.Text>
                       <Card.Text  className="text-light">
                         <strong>Author</strong> {blog.tags.join(", ")}<br/>
                         <strong>date</strong>{blog.createdAt}
                       </Card.Text>
                       <Button variant="primary" onClick={() => navigate(`/blog/${blog._id}`)}   className="w-100 gradient-btn">
                         Read Now
                       </Button>
                     </Card.Body>
                   </Card>
                 </Col>
               ))
             ) : (
               <p className="text-center">No blogs available.</p>
             )}
           </Row>
         </Container>
         <Footer/>
         </>
  )
}

export default Totalblogs