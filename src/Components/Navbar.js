import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faSearch } from "@fortawesome/free-solid-svg-icons";
import "../style.css";

export default function NavbarComponent() {
  const { currentUser } = useAuth();

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="small"
      style={{ minWidth: "300px" }}
    >
      <Navbar.Brand as={Link} to="/" className="ml-2">
        <div>
          <b>
            <i>THINK IT </i>
            🤔
          </b>
        </div>
      </Navbar.Brand>
      <Nav className=" flex-row ">
        {currentUser ? (
          <>
            <Nav.Item className="mr-4 " style={{ paddingTop: "15px" }}>
              <Nav.Link title="Search" as={Link} to="/search">
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{ height: "30px", width: "30px" }}
                />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mr-4 " style={{ paddingTop: "15px" }}>
              <Nav.Link title="New Thought" as={Link} to="/upload">
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  style={{ height: "30px", width: "30px" }}
                />
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="mr-3.5">
              <Nav.Link title="Profile" as={Link} to="/user">
                <img
                  src={currentUser.photoURL}
                  alt="user pic"
                  className="rounded-circle"
                  style={{ height: "60px", width: "60px" }}
                />
              </Nav.Link>
            </Nav.Item>{" "}
          </>
        ) : (
          <>
            <Nav.Item className="mr-3.5" style={{ paddingTop: "15px" }}>
              <Nav.Link title="login" as={Link} to="/login">
                <h5 className="authLink">Login here</h5>
              </Nav.Link>
            </Nav.Item>
          </>
        )}
      </Nav>
    </Navbar>
  );
}
