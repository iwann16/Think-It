import React, { useState } from "react";
import Navbar from "./Navbar";
import { Form, Button, Alert, Card, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import Footer from "./Footer";
import { useHistory } from "react-router-dom";

export default function NotFoundPage() {
  const history = useHistory();

  return (
    <>
      <Navbar />
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "101vh" }}
      >
        <div className="w-50" style={{ minWidth: "350px" }}>
          <Card bg="dark" text="light">
            <Card.Body>
              <div>
                <div className="d-flex justify-content-center align-items-center ">
                  <h3 style={{ color: "red" }}>
                    404
                    <span style={{ color: "white" }}> Page Not Found</span> !
                  </h3>
                </div>
                <div className="d-flex justify-content-between">
                  <div>
                    <FontAwesomeIcon size="9x" icon={faFrown} />
                  </div>
                  <div className="ml-2">
                    <p style={{ fontSize: "22px" }}>
                      It seems that this page does not exits.
                      <span
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => history.push("/")}
                      >
                        {" "}
                        Click here
                      </span>{" "}
                      to go back to home page!
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
      <Footer />
    </>
  );
}
