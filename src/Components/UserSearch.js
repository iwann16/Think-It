import React, { useState, useEffect } from "react";
import { Container, Card, Button, Alert } from "react-bootstrap";
import Navbar from "./Navbar";
import { db } from "../firebase";
import moment from "moment";
import { useHistory, useParams } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../style.css";
import Footer from "./Footer";

export default function UserSearch() {
  const { user } = useParams();

  const history = useHistory();
  const { currentUser } = useAuth();

  const [theUser, setTheUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [thePosts, setThePosts] = useState([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [warning, setWarnings] = useState("");

  const getUser = async (username) => {
    setLoading(true);
    await db
      .collection("Users")
      .where("username", "==", username)
      .onSnapshot((snapshot) =>
        snapshot.docs.map((doc) => setTheUser(doc.data()))
      );

    setLoading(false);
  };

  const getPosts = () => {
    return db
      .collection("Posts")
      .where("username", "==", user)
      .onSnapshot((snapShot) => {
        setThePosts(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
  };

  useEffect(() => {
    getUser(user);
    getPosts();
  }, []);

  const handleLike = async (id) => {
    setLoadingPost(true);
    const res = await db.collection("Posts").doc(id);
    const data = (await db.collection("Posts").doc(id).get()).data();
    const { likes } = data;

    const like = (likeObject) => {
      const { likeCount } = likeObject;
      const { likers } = likeObject;

      //if has liked then unlike
      if (likers.find((user) => user.userId === currentUser.uid)) {
        const theLiker = likers.findIndex(
          (user) => user.userId === currentUser.uid
        );
        return res.update({
          likes: {
            likeCount: likeCount - 1,
            likers: likers.splice(likers, theLiker),
          },
        });
      }

      //like
      likers.push({
        userId: currentUser.uid,
        username: currentUser.displayName,
        profilePic: currentUser.photoURL,
      });
      const newLikes = likers.length;

      return res.update({
        likes: {
          likeCount: newLikes,
          likers: likers,
        },
      });
    };

    like(likes);
    setLoadingPost(false);
  };

  return (
    <>
      <Navbar />
      <Container fluid style={{ color: "white" }}>
        <Container
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-50" style={{ minWidth: "350px" }}>
            <Card bg="dark" text="light" style={{ marginTop: "50px" }}>
              <Card.Body>
                {!theUser || loading ? (
                  <div className="d-flex justify-content-center">
                    <div className="lds-ripple">
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {" "}
                    <div className="d-flex justify-content-center align-items-center">
                      <img
                        src={theUser.profilePic}
                        alt="user pic"
                        className="rounded-circle"
                      />
                    </div>
                    <div className="mt-2">
                      <div className="d-flex justify-content-center">
                        <strong>{theUser.username}</strong>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mt-3">
                      <Card
                        style={{
                          width: "80px",
                          height: "80px",
                          marginTop: "2px",
                        }}
                        bg="secondary"
                        text="light"
                      >
                        <Card.Body style={{ padding: "25px" }}>
                          <div
                            className="d-flex justify-content-center align-items-center "
                            style={{ height: "100%", width: "100%" }}
                          >
                            <strong style={{ fontSize: "30px" }}>
                              {theUser.posts.length}
                            </strong>
                          </div>
                        </Card.Body>
                        <Card.Footer style={{ padding: "5px" }}>
                          <div className="d-flex justify-content-center align-items-center">
                            <p style={{ marginTop: "-3px" }}>POSTS</p>
                          </div>
                        </Card.Footer>
                      </Card>

                      <Card
                        style={{
                          width: "80px",
                          height: "80px",
                          marginTop: "2px",
                        }}
                        bg="secondary"
                        text="light"
                      >
                        <Card.Body style={{ padding: "25px" }}>
                          <div
                            className="d-flex justify-content-center align-items-center "
                            style={{ height: "100%", width: "100%" }}
                          >
                            <strong style={{ fontSize: "30px" }}>
                              {theUser.posts.length}
                            </strong>
                          </div>
                        </Card.Body>
                        <Card.Footer style={{ padding: "5px" }}>
                          <div className="d-flex justify-content-center align-items-center">
                            <p style={{ marginTop: "-3px" }}>POSTS</p>
                          </div>
                        </Card.Footer>
                      </Card>
                      <Card
                        style={{
                          width: "80px",
                          height: "80px",
                          marginTop: "2px",
                        }}
                        bg="secondary"
                        text="light"
                      >
                        <Card.Body style={{ padding: "25px" }}>
                          <div
                            className="d-flex justify-content-center align-items-center "
                            style={{ height: "100%", width: "100%" }}
                          >
                            <strong style={{ fontSize: "30px" }}>
                              {theUser.posts.length}
                            </strong>
                          </div>
                        </Card.Body>
                        <Card.Footer style={{ padding: "5px" }}>
                          <div className="d-flex justify-content-center align-items-center">
                            <p style={{ marginTop: "-3px" }}>POSTS</p>
                          </div>
                        </Card.Footer>
                      </Card>
                      <Card
                        style={{
                          width: "80px",
                          height: "80px",
                          marginTop: "2px",
                        }}
                        bg="secondary"
                        text="light"
                      >
                        <Card.Body style={{ padding: "25px" }}>
                          <div
                            className="d-flex justify-content-center align-items-center "
                            style={{ height: "100%", width: "100%" }}
                          >
                            <strong style={{ fontSize: "30px" }}>
                              {theUser.posts.length}
                            </strong>
                          </div>
                        </Card.Body>
                        <Card.Footer style={{ padding: "5px" }}>
                          <div className="d-flex justify-content-center align-items-center">
                            <p style={{ marginTop: "-3px" }}>POSTS</p>
                          </div>
                        </Card.Footer>
                      </Card>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
            <div className="d-flex justify-content-start align-items-start mt-3 mb-1 ml-1">
              <h3 className="text-center">
                <b>{theUser && theUser.username}</b> Posts
              </h3>
            </div>
            <div className="justify-content-center align-items-center">
              {!theUser || loading ? (
                <div className="d-flex justify-content-center">
                  <div className="lds-ripple">
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : theUser && theUser.posts.length === 0 ? (
                <p>
                  <b>{theUser.username}</b> has 0 posts!
                </p>
              ) : (
                thePosts.map((post) => (
                  <>
                    {warning && (
                      <Alert
                        style={{ cursor: "pointer" }}
                        variant="danger"
                        onClick={() => history.push("/login")}
                      >
                        {warning}
                      </Alert>
                    )}
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
                              src={post.profilePic}
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
                          <div className="d-flex justify-content-start "></div>
                          <div className=" d-flex justify-content-end">
                            {currentUser != null ? (
                              post.likes.likers.find(
                                (user) => user.userId === currentUser.uid
                              ) ? (
                                <Button
                                  variant="secondary"
                                  disabled={loadingPost}
                                  onClick={() => handleLike(post.id)}
                                >
                                  <FontAwesomeIcon icon={faHeart} />
                                </Button>
                              ) : (
                                <Button
                                  variant="danger"
                                  disabled={loadingPost}
                                  onClick={() => handleLike(post.id)}
                                >
                                  <FontAwesomeIcon icon={faHeart} />
                                </Button>
                              )
                            ) : (
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setWarnings("");
                                  setWarnings("Please Log In ");
                                }}
                              >
                                <FontAwesomeIcon icon={faHeart} />
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className=" d-flex justify-content-end">
                          <p className="pl-1 ">
                            {post.likes.likeCount}{" "}
                            {post.likes.likeCount === 1 ? "like " : "likes"}
                          </p>
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
                  </>
                ))
              )}
            </div>
          </div>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
