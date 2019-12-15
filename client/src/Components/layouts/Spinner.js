import React from "react";
import styled from "styled-components";

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 80px;
`;
const Img = styled.img`
  width: 200px;
  margin: auto;
  display: block;
`;

export default () => {
  return (
    <Container>
      <Img src={require("../../assets/spinner.png")} alt="Loading..." />
    </Container>
  );
};
