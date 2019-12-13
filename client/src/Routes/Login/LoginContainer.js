import React, { useState } from "react";
import LoginPresenter from "./LoginPresenter";

const LoginContainer = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleSubmit = e => {
    e.preventDefault();
    console.log(e.target);
  };
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <LoginPresenter
      {...formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
export default LoginContainer;
