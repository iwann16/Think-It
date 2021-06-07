import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Container } from "react-bootstrap";
import Feed from "./Feed";

export default function Dashboard() {
  return (
    <>
      <Navbar />
      <Container fluid style={{ color: "white" }}>
        <Feed />
      </Container>
      <Footer />
    </>
  );
}
