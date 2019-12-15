import React, { useEffect } from "react";
import ProfilePresenter from "./ProfilePresenter";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentProfile } from "../../actions/profile";
import Spinner from "../../Components/layouts/Spinner";
import Alert from "../../Components/layouts/Alert";

const ProfileContainer = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const profile = useSelector(state => state.profile);

  useEffect(() => {
    dispatch(getCurrentProfile());
  }, [getCurrentProfile]);

  return (
    <>
      {profile && profile.loading ? (
        <Spinner />
      ) : (
        <>
          <Alert />
          <ProfilePresenter profile={profile} auth={auth} />
        </>
      )}
    </>
  );
};
export default ProfileContainer;
