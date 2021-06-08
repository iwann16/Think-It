import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { db } from "../firebase";
import moment from "moment";
import { useAuth } from "../Contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import "../style.css";
import { Button } from "react-bootstrap";
import { useHistory } from "react-router";

export default function Feed() {
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const loadPosts = () => {
    return db
      .collection("Posts")
      .where("userId", "!=", currentUser.uid)
      .onSnapshot((snapShot) => {
        setPosts(
          snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLike = async (id) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "102vh" }}
      >
        <div className="w-100" style={{ minWidth: "300px" }}>
          <div className="d-flex justify-content-center align-items-center mt-3 mb-3 ">
            <h3 className="text-center">My Feed</h3>
          </div>

          <div className="justify-content-center align-items-center">
            {posts.length === 0 ? (
              <div className="d-flex justify-content-center">
                <div className="lds-ripple">
                  <div></div>
                  <div></div>
                </div>
              </div>
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
                      <div
                        className="d-flex justify-content-start"
                        style={{ cursor: "pointer" }}
                        onClick={() => history.push(`/search/${post.username}`)}
                      >
                        <img
                          src={post.profilePic}
                          alt="user pic"
                          style={{
                            width: "96px",
                            height: "96px",
                          }}
                          className="rounded-circle  mr-4 mb-2"
                        />
                        <div
                          style={{
                            overflow: "hidden",
                            whiteSpace: "wrap",
                          }}
                        >
                          <strong>{post.username}</strong>{" "}
                          <div className="d-flex flex-column">
                            <p className="w-100 mt-2">{post.content}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" d-flex justify-content-end">
                      {post.likes.likers.find(
                        (user) => user.userId === currentUser.uid
                      ) ? (
                        <Button
                          variant="secondary"
                          disabled={loading}
                          onClick={() => handleLike(post.id)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </Button>
                      ) : (
                        <Button
                          variant="danger"
                          disabled={loading}
                          onClick={() => handleLike(post.id)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                        </Button>
                      )}
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
              ))
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
