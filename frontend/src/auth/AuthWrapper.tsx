import { createContext, useContext, useState } from "react";
import RenderHeader from "../components/structure/Header.tsx";
import RenderRoutes from "../components/structure/RenderRoutes.tsx";
import RenderMenu from "../components/structure/RenderMenu.tsx";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const AuthContext = createContext({
  user: { name: "", isAuthenticated: false, id: "" },
  login: (username, password) => {},
  logout: () => {},
  createAccount: (username: string, password1: string, password2: string) => {},
});
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
  const [user, setUser] = useState({
    name: "",
    isAuthenticated: false,
    id: "",
  });

  const login = async (userName, password) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        username: userName,
        password: password,
      });
      const data = response.data;
      console.log("DATA: " + data);
      // Handle the response data

      return new Promise((resolve, reject) => {
        if (data.username === userName) {
          console.log("USER ID =" + data.id);
          console.log("USERNAME =" + data.username);
          setUser({ name: userName, isAuthenticated: true, id: data.id });
          resolve("success");
        } else {
          reject("Incorrect password");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors
      return new Promise((resolve, reject) => {
        reject("Incorrect password");
      });
    }

    // Make a call to the authentication API to check the username
  };

  const createAccount = async (userName, password1, password2) => {
    if (password1 !== password2) {
      return new Promise((resolve, reject) => {
        reject("Passwords do not match");
      });
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/create/user",
        { username: userName, password: password1 }
      );
      const data = response.data;
      const errMsg = response.statusText;

      await new Promise((resolve, reject) => {
        setUser({ name: userName, id: data.id, isAuthenticated: true });
        resolve("success");
      });
      return login(userName, password1);
    } catch (error) {
      console.error("Error:", error);
      // Handle any errors
      return new Promise((resolve, reject) => {
        reject("Try a different username");
      });
    }

    // Make a call to the authentication API to check the username
  };

  const logout = () => {
    setUser({ name: "", isAuthenticated: false, id: "" });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, createAccount }}>
      <>
        <RenderMenu />
        <RenderRoutes />
      </>
    </AuthContext.Provider>
  );
};
