import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { db } from "../firebase";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { useAuth } from "../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faArrowAltCircleLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory, useParams } from "react-router-dom";
import Footer from "./Footer";

export default function Upload() {
  const { currentUser, deletePost } = useAuth();
  const history = useHistory();

  const { postId } = useParams();

  //state of post
  const [content, setContent] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  //load post from db
  const loadPost = (id) => {
    return db
      .collection("Posts")
      .doc(id)
      .get()
      .then((doc) => setContent(doc.data().content));
  };

  //execute loading
  useEffect(() => {
    loadPost(postId);
  }, []);

  const handleExit = () => {
    //states at ""
    setContent("");
    setError("");
    setSuccess("");

    //redirect
    history.push("/user");
  };

  //delete a post
  const handlePostDelete = async (id) => {
    setError("");
    setSuccess("");
    setLoading(true);

    const user = await db.collection("Users").doc(currentUser.uid);

    const userData = (
      await db.collection("Users").doc(currentUser.uid).get()
    ).data();

    const { posts } = userData;

    const postIndex = posts.indexOf(id);

    try {
      user.update({
        posts: posts.splice(posts, postIndex),
      });
      await deletePost(id);
      setSuccess("Succesfully deleted");
    } catch (err) {
      setLoading(false);
      setError("Failed to delete");
      console.log(err);
    }

    setTimeout(() => {
      history.push("/user");
      setSuccess("");
      setLoading(false);
      setError("");
    }, 2000);
  };

  //edit a post
  const handleSubmit = async (e) => {
    e.preventDefault();

    //edit post
    setLoading(true);
    try {
      await db
        .collection("Posts")
        .doc(postId)
        .update({
          content: content,
        })
        .then(() => {
          setSuccess("Successfully edited!");
          setLoading(false);
          setError("");
        });
    } catch (err) {
      setLoading(false);
      setError("Something went wrong!");
      setSuccess("");
    }

    setTimeout(() => {
      //reset state of post
      history.push("/user");
      setContent("");
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
              <h2 className="text-center mb-4">Edit thought...💭</h2>
              <Form onSubmit={handleSubmit}>
                <div className="d-flex ">
                  <img
                    src={currentUser.photoURL}
                    alt="user pic"
                    className="rounded-circle mb-4 mr-4 ml-2"
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
                  <div>
                    <Button
                      onClick={handleExit}
                      variant="danger"
                      className="w-20 mr-2"
                    >
                      <FontAwesomeIcon
                        title="Exit"
                        icon={faArrowAltCircleLeft}
                      />
                    </Button>
                    <Button
                      className="w-20"
                      variant="danger"
                      disabled={loading}
                      onClick={() => handlePostDelete(postId)}
                    >
                      <FontAwesomeIcon title="delete" icon={faTrashAlt} />
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-50"
                    variant="secondary"
                    disabled={loading}
                  >
                    <strong>Update </strong>
                    <FontAwesomeIcon icon={faEdit} />
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
