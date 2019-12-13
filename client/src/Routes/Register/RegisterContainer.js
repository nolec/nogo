import React, { useState } from "react";
import RegisterPresenter from "./RegisterPresenter";
import { useSelector, useDispatch } from "react-redux";
import { setAlert } from "../../actions/alert";
import { register } from "../../actions/auth";

const RegisterContainer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const dispatch = useDispatch();

  let { name, email, password, password2 } = formData;
  const handleSubmit = e => {
    e.preventDefault();
    if (password !== password2) {
      //서버에서 보내주는 Error 표출(action을 취할 것)
      dispatch(setAlert("패스워드가 다릅니다.", "danger"));
    } else {
      //다 오케이 되면 등록!
      dispatch(register(name, email, password));
    }
  };
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <RegisterPresenter
      {...formData}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};
export default RegisterContainer;
