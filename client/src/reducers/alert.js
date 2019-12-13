import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT: {
      return [...state, payload];
    }
    case REMOVE_ALERT: {
      //fileter ===> alert라는 배열을 하나씩 풀어서 조건에 맞는것만 뱉어라
      return state.filter(alert => alert.id !== payload);
    }
    default:
      return state;
  }
}
