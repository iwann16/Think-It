import React, { useState } from "react";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { Link, useHistory } from "react-router-dom";
import { googleProvider, facebookProvider } from "../../firebase";
import { useAuth } from "../../Contexts/AuthContext";
import Footer from "../Footer";

export default function Login() {
  const history = useHistory();

  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (provider) => {
    setLoading(true);
    try {
      setError("");
      await login(provider);
      history.push("/");
    } catch (err) {
      if (err.code === "auth/account-exists-with-different-credential")
        setError("This email already exists, Try loggin with Google!");
    }

    setLoading(false);
  };

  return (
    <>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "101vh" }}
      >
        <div className="w-50" style={{ minWidth: "350px" }}>
          <Card bg="dark" text="light">
            <Card.Body>
              <h2 className="text-start mt-2 font-weight-bold mb-3">WELCOME</h2>
              <p className="mb-3">
                By logging in you accept our{" "}
                <Link to="/" style={{ color: "red" }}>
                  Privacy <br></br>Policy
                </Link>{" "}
                and{" "}
                <Link to="/" style={{ color: "red" }}>
                  Terms of Service
                </Link>
              </p>
              <div className="d-flex flex-column">
                <div className="d-flex justify-content-center align-items-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="mb-3"
                    style={{ width: "250px" }}
                    onClick={() => handleLogin(googleProvider)}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                    Login with Google
                  </Button>
                </div>
                <div className=" d-flex justify-content-center align-items-center">
                  <Button
                    size="lg"
                    variant="secondary"
                    style={{ width: "250px" }}
                    onClick={() => handleLogin(facebookProvider)}
                  >
                    <FontAwesomeIcon icon={faFacebook} className="mr-2" />
                    Login with Facebook
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
          {error && <Alert variant="danger">{error}</Alert>}
        </div>
      </Container>
      <Footer />
    </>
  );
}
