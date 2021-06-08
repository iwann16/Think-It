import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import moment from "moment";
import { Container, Card, Button, Alert, Modal } from "react-bootstrap";
import Navbar from "../../Components/Navbar";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faTrashAlt,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import "../../style.css";
import Footer from "../Footer";

export default function User() {
  const [usersThatLiked, setUsersThatLiked] = useState([]);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    currentUser,
    logout,
    userDelete,
    deletePostsIfUserDeletesAccount,
    userDocDelete,
  } = useAuth();
  const history = useHistory();

  const openModal = (modal) => {
    setError("");
    if (modal === 1) {
      setOpen1(true);
    } else {
      setOpen2(true);
    }
  };
  const closeModal = (modal) => {
    if (modal === 1) {
      setOpen1(false);
    } else {
      setOpen2(false);
    }
  };

  //log out
  const handelLogout = async () => {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch (err) {
      setError("Failed to log out");
      console.log(err);
    }
  };

  //delete user
  const handleDelete = async () => {
    setError("");

    try {
      closeModal(1);
      await userDocDelete(currentUser.uid);
      await userDelete();
      await deletePostsIfUserDeletesAccount();
      history.push("/login");
    } catch (err) {
      setError("Failed to delete user, please re-login and try again!");
    }
  };

  //get user posts
  const usePosts = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      db.collection("Posts")
        .where("userId", "==", currentUser.uid)
        .orderBy("createdAt", "desc")
        .onSnapshot((snapshot) => {
          const newPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setPosts(newPosts);
        });
    }, []);

    return posts;
  };
  //the actual posts
  const posts = usePosts();

  const handleEdit = (postId) => {
    history.push(`/edit/${postId}`);
  };

  //load user who liked
  const loadUsersWhoLiked = async (postId) => {
    setLoading(true);

    const data = (await db.collection("Posts").doc(postId).get()).data();
    const { likes } = data;

    //who liked info in object
    const whoLiked = likes.likers;
    setUsersThatLiked(whoLiked);

    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <Container fluid style={{ color: "white" }}>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "101vh" }}
        >
          <div className="w-50" style={{ minWidth: "350px" }}>
            <div className="d-flex justify-content-start align-items-start mt-3 mb-1 ml-1">
              <h3 className="text-center">My Profile</h3>
            </div>
            <Card bg="dark" text="light">
              <Card.Body>
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={currentUser.photoURL}
                    alt="user pic"
                    className="rounded-circle"
                  />
                </div>
                <div className="d-flex flex-column">
                  <div className="d-flex">
                    <strong>{currentUser.displayName}</strong>
                  </div>
                  <div className="d-flex">{currentUser.email}</div>
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant="dark" onClick={() => openModal(1)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </Button>
                </div>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end ">
                <Button variant="secondary" onClick={handelLogout}>
                  Logout <FontAwesomeIcon icon={faSignOutAlt} />
                </Button>
              </Card.Footer>
            </Card>
            {error && <Alert variant="danger">{error}</Alert>}
            <Modal
              show={open1}
              onHide={() => closeModal(1)}
              backdrop="static"
              keyboard={false}
              className="warning_modal"
            >
              <Modal.Body>
                <h2>
                  Are you sure you want to{" "}
                  <strong className="text-danger">delete</strong> this account?
                </h2>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => closeModal(1)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>

            {/*user feed*/}
            <div className="w-100" style={{ minWidth: "300px" }}>
              <div className="d-flex justify-content-start align-items-start mt-3 mb-1 ml-1">
                <h3 className="text-center">My Thoughts</h3>
              </div>

              <div className="justify-content-center align-items-center">
                {posts.length === 0 ? (
                  <p>
                    You dont have any thoughts yet...
                    <Link style={{ color: "red" }} to="/upload">
                      Create one!
                    </Link>
                  </p>
                ) : (
                  posts.map((post) => (
                    <Card
                      bg="dark"
                      text="light"
                      className="w-100 mb-4 mt-2"
                      key={post.id}
                    >
                      <Card.Body>
                        <div className="d-flex flex-column">
                          <div className="d-flex justify-content-start">
                            <img
                              src={currentUser.photoURL}
                              alt="user pic"
                              style={{
                                width: "96px",
                                height: "96px",
                              }}
                              className="rounded-circle  mr-4 "
                            />
                            <div
                              style={{
                                overflow: "hidden",
                                whiteSpace: "wrap",
                              }}
                            >
                              <strong>{post.username} </strong>{" "}
                              <span className="text-muted">You</span>
                              <div className="d-flex flex-column">
                                <p className="w-100 mt-2"> {post.content}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div className="d-flex justify-content-start ">
                            <Button
                              type="submit"
                              className="w-20 mt-2 mb-2"
                              style={{ marginLeft: "0px" }}
                              variant="secondary"
                              onClick={() => handleEdit(post.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </Button>
                          </div>
                          <div className="d-flex justify-content-end ">
                            <Link
                              onClick={() => {
                                openModal(2);
                                loadUsersWhoLiked(post.id);
                              }}
                              className="  pl-1 "
                              style={{ color: "red" }}
                            >
                              {post.likes.likeCount}{" "}
                              {post.likes.likeCount === 1 ? "like " : "likes"}
                            </Link>
                          </div>
                        </div>
                        <div
                          className="d-flex justify-content-start"
                          style={{ height: "3px" }}
                        >
                          <span
                            className="text-muted"
                            style={{ position: "absolute", left: "3px" }}
                          >
                            {moment(post.createdAt.toDate()).calendar()}
                          </span>
                        </div>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </div>
              <Modal
                show={open2}
                size="sm"
                className="likes_modal"
                onHide={() => closeModal(2)}
              >
                <Modal.Header>
                  <h2>Likes:</h2>
                </Modal.Header>
                <Modal.Body>
                  {loading ? (
                    <div className="d-flex justify-content-center">
                      <div className="lds-ripple">
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  ) : usersThatLiked.length === 0 ? (
                    <h3 className="text-center">No likes yet 😥 </h3>
                  ) : (
                    usersThatLiked.map((user) => (
                      <div
                        className="d-flex flex-inline mb-2 "
                        style={{ cursor: "pointer" }}
                        onClick={() => history.push(`/search/${user.username}`)}
                      >
                        <div className="d-flex justify-content-start mr-2">
                          <img
                            src={user.profilePic}
                            alt="user pic"
                            className="rounded-circle"
                            style={{ width: "40px", height: "40px" }}
                          />
                        </div>
                        <div
                          className="d-flex justify-content-start"
                          style={{ marginTop: "7px" }}
                        >
                          <p>{user.username}</p>
                        </div>
                      </div>
                    ))
                  )}
                </Modal.Body>
                <Modal.Footer style={{ padding: "-0.25rem" }}>
                  <h2 style={{ color: "red" }}>{usersThatLiked.length}</h2>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
