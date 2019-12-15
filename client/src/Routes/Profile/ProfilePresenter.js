import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ProfileActions from "./ProfileActions";

const Main = styled.main`
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
`;

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
const ProfileBox = styled.div`
  color: #fff;
  height: 100%;
  width: 80%;
  margin: auto;
`;
const Title = styled.h2``;
const MyProfile = styled.section``;
const Create = styled(Link)`
  max-width: 120px;
  display: flex;
  padding: 5px 10px;
  background-color: #fff;
  justify-content: center;
  border-radius: 5px;
`;
const ProfilePresenter = ({ auth, profile }) => {
  if (auth.isAuthenticated) {
    return (
      <Main>
        <Container>
          <ProfileBox>
            {profile.profile !== null ? (
              <>
                <Title>{auth.user && auth.user.name} 님의 프로필 </Title>
                <MyProfile>
                  <ProfileActions />
                </MyProfile>
              </>
            ) : (
              <MyProfile>
                <p>
                  아직 프로필이 없습니다.
                  <br />
                  프로필을 추가해주세요
                </p>
                <Create to="/create-profile">프로필 추가</Create>
              </MyProfile>
            )}
          </ProfileBox>
        </Container>
      </Main>
    );
  } else {
    return (
      <Main>
        <Container>
          <div></div>
        </Container>
      </Main>
    );
  }
};

export default ProfilePresenter;
