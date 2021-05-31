import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { db } from "../firebase";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useAuth } from "../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShareSquare,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import Footer from "./Footer";

export default function Upload() {
  const { currentUser } = useAuth();
  const history = useHistory();

  //state of post
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleExit = () => {
    //states at ""
    setContent("");
    setError("");
    setSuccess("");

    //redirect
    history.push("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const user = (
      await db.collection("Users").doc(currentUser.uid).get()
    ).data();

    const { posts } = user;

    try {
      await db
        .collection("Posts")
        .add({
          //include to db
          content: content,
          userId: currentUser.uid,
          username: currentUser.displayName,
          profilePic: currentUser.photoURL,
          likes: {
            likeCount: 0,
            likers: [],
          },
          createdAt: new Date(),
        })
        .then((doc) => posts.push(doc.id))
        .then(() => {
          db.collection("Users").doc(currentUser.uid).update({ posts: posts });
          setSuccess("Successfully posted!");
          setLoading(false);
          setError("");
          setTimeout(() => history.push("/"), 2000);
        });
    } catch (err) {
      setLoading(false);
      setError("Something went wrong!");
      setSuccess("");
    }

    //reset state of post
    setContent("");

    setTimeout(() => {
      setSuccess("");
      setError("");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-50" style={{ minWidth: "350px" }}>
          <Card bg="dark" text="light">
            <Card.Body>
              <h2 className="text-center mb-4">New thought...💭</h2>
              <Form onSubmit={handleSubmit}>
                <div className="d-flex ">
                  <img
                    src={currentUser.photoURL}
                    alt="user pic"
                    className="rounded-circle mb-4 mr-4 ml-2"
                    style={{ width: "96px", height: "96px" }}
                  />
                  <Form.Group>
                    <Form.Control
                      className="w-100"
                      plaintext
                      style={{
                        resize: "none",
                        outline: "none",
                        color: "white",
                        overflow: "hidden",
                      }}
                      as="textarea"
                      cols={50}
                      rows={3}
                      type="text"
                      autoFocus
                      maxLength="120"
                      placeholder="What are you thinking?"
                      value={content}
                      required
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="d-flex justify-content-between">
                  <Button
                    onClick={handleExit}
                    variant="danger"
                    className="w-20"
                  >
                    <FontAwesomeIcon title="Exit" icon={faArrowAltCircleLeft} />
                  </Button>
                  <Button
                    type="submit"
                    className="w-50"
                    variant="secondary"
                    disabled={loading}
                  >
                    <strong>Post </strong>
                    <FontAwesomeIcon icon={faShareSquare} />
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
        </div>
      </Container>
      <Footer />
    </>
  );
}
