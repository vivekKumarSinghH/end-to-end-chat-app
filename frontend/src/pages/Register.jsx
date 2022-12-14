import React, { useState, useEffect } from "react";
import "./login.css";
import axios from "axios";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerRoute } from "../utils/APIRoutes";
import { JSEncrypt } from "jsencrypt";
export default function Register() {
  
  const navigate = useNavigate();
  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    
    if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
      navigate("/");
    }
  }, []);

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = values;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Username should be greater than 3 characters.",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater than 8 characters.",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required.", toastOptions);
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { email, username, password } = values;
     
      // Generate a RSA key pair using the `JSEncrypt` library.
      var crypt = new JSEncrypt({default_key_size: 2048});
      var PublicPrivateKey = {
          PublicKey: crypt.getPublicKey(),
          PrivateKey:crypt.getPrivateKey()
      };

      // PUBLIC KEY
      var publicKey = PublicPrivateKey.PublicKey;
  
      var privateKey = PublicPrivateKey.PrivateKey;
  
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
        publicKey
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(data.user)
        );
        localStorage.setItem("privateKey",JSON.stringify(privateKey))
        navigate("/");
      }
    }
  };

  return (
    <>
      <div className="loginpage">
        <form
          className="formdiv"
          action=""
          onSubmit={(event) => handleSubmit(event)}
        >
          <div className="brand">
            {/* <img src={Logo} alt="logo" /> */}
            <h1>Sandesh</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
          />
          <button type="submit">Register</button>
          <span>
            Already have an account ?{" "}
            <Link className="regi" to="/login">
              Login.
            </Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </>
  );
}
