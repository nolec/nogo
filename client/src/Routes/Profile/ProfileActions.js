import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div``;
const Alink = styled(Link)``;

const ProfileActions = () => {
  return (
    <Container>
      <Alink to="/edit-profile">프로필 편집</Alink>
      <Alink to="/add-experience">경력 추가</Alink>
      <Alink to="/add-education">교육 추가</Alink>
    </Container>
  );
};

export default ProfileActions;
