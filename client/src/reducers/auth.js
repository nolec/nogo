import { REGISTER_FAIL, REGISTER_SUCCESS } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS: {
      return [...state, payload];
    }
    case REGISTER_FAIL: {
      return payload;
    }
    default:
      return state;
  }
}
