import React from "react";
import Upload from "./Upload";
import Login from "./Auth/Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../Contexts/AuthContext";
import Dashboard from "./Dashboard";
import PrivateRoute from "../Hooks/PrivateRoute";
import User from "./Auth/User";
import EditUpload from "./EditUpload";
import Search from "./Search";
import "../style.css";
import UserSearch from "./UserSearch";
import NotFoundPage from "./NotFoundPage";

export default function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Switch>
            {/*Auth */}

            <PrivateRoute path="/user" component={User} />
            <Route path="/login" component={Login} />

            <PrivateRoute path="/search" exact component={Search} />
            <Route path="/search/:user" exact component={UserSearch} />
            <PrivateRoute path="/" exact component={Dashboard} />
            <PrivateRoute path="/upload" component={Upload} />
            <PrivateRoute path="/edit/:postId" component={EditUpload} />
            <Route component={NotFoundPage} />
          </Switch>
        </AuthProvider>
      </Router>
    </>
  );
}
