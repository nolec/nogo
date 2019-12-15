import { GET_PROFILE, PROFILE_ERROR } from "./types";
import axios from "axios";
import { setAlert } from "./alert";

export const getCurrentProfile = () => async dispatch => {
  try {
    const res = await axios.get("/api/profile/me");

    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
export const createProfile = (
  formData,
  history,
  edit = false
) => async dispatch => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const res = await axios.post("/api/profile/cu", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data
    });
    dispatch(
      setAlert(
        edit ? "프로필이 업데이트 되었습니다." : "프로필이 생성되었습니다."
      )
    );
    if (!edit) {
      history.push("/profile");
    }
  } catch (error) {
    const errors = error.response.data.Errors;
    if (errors) {
      errors.map(error => {
        dispatch(setAlert(error.msg, "danger"));
      });
    }
    dispatch({
      type: PROFILE_ERROR,
      payload: { msg: error.response.statusText, status: error.response.status }
    });
  }
};
