import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div
      className="d-flex justify-content-center "
      style={{ margin: 0, padding: 0 }}
    >
      <Link
        to={{
          pathname: "https://www.instagram.com/iwannidhs._/",
        }}
        target="_blank"
        style={{ color: "red" }}
      >
        © Iwann
      </Link>
    </div>
  );
}
