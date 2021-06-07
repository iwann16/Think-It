import React from "react";
import { Navbar } from "react-bootstrap";

export default function Footer() {
  return (
    <Navbar
      sticky="bottom"
      style={{ minWidth: "300px", minHeight: "10px" }}
    ></Navbar>
  );
}
