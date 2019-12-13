import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

const AlertBox = styled.div`
  &.alert {
    padding: 0.8rem;
    margin: 1rem 0;
    opacity: 0.9;
    background: inherit;
    color: #333;
    border-radius: 5px;
  }
  &.alert-danger {
    background: #ff0000cf;
    color: #fff;
  }
`;

const Alert = () => {
  const alerts = useSelector(state => state.alert);
  return (
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
      <AlertBox key={alert.id} className={`alert alert-${alert.alertType}`}>
        {alert.msg}
      </AlertBox>
    ))
  );
};

export default Alert;
