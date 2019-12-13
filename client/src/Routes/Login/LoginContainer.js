import React, { useState } from "react";
import LoginPresenter from "./LoginPresenter";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions/auth";

const LoginContainer = props => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const { email, password } = formData;
  const handleSubmit = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <LoginPresenter
      isAuthenticated={isAuthenticated}
      {...formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
export default LoginContainer;
