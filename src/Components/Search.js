import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { db } from "../firebase";
import { Form, Button, Card, Container } from "react-bootstrap";
import { useAuth } from "../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory } from "react-router-dom";
import Footer from "./Footer";
import "../style.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [you, setYou] = useState(false);

  const history = useHistory();
  const { currentUser } = useAuth();

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setUsers([]);
    setYou(false);

    db.collection("Users")
      .where("username", "==", query)
      .onSnapshot((snapShot) => {
        snapShot.docs.map((user) => setUsers([user.data()]));
      });

    if (query === currentUser.displayName) setYou(true);

    setTimeout(() => setLoading(false), 300);
  };

  return (
    <>
      <Navbar />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "101vh", color: "white" }}
      >
        <div className="w-50" style={{ minWidth: "350px" }}>
          <h2 className="text-center mb-4">Search User</h2>
          <Card bg="dark" text="light">
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <div className="d-flex">
                  <Form.Control
                    placeholder="search users..."
                    value={query}
                    autoFocus
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <Button variant="danger" type="submit" className="ml-2">
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <h2 className="text-center mb-4 mt-4">Results:</h2>
          <Card bg="dark" text="light">
            <Card.Body>
              {loading ? (
                <div className="d-flex justify-content-center">
                  <div className="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <h5 className="text-center ">No results yet😞</h5>
              ) : (
                users.map((user) => (
                  <div
                    onClick={() =>
                      you
                        ? history.push("/user")
                        : history.push(`/search/${user.username}`)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex flex-column">
                      <div className="d-flex justify-content-start">
                        <img
                          src={user.profilePic}
                          alt="user pic"
                          className="rounded-circle mr-4"
                          style={{ width: "60px", height: "60px" }}
                        />
                        <div
                          style={{
                            overflow: "hidden",
                            whiteSpace: "wrap",
                          }}
                        >
                          <strong>{user.username} </strong>{" "}
                          {you ? <span className="text-muted">You</span> : ""}
                          <div className="d-flex flex-column">
                            <strong className="w-100 mt-2">
                              {" "}
                              {user.posts.length}{" "}
                              {user.posts.length === 1 ? "post " : "posts"}
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </div>
      </Container>
      <Footer />
    </>
  );
}
