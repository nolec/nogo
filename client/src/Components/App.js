import React, { useEffect } from "react";
import GlobalStyles from "./GlobalStyles";
import Router from "./Router";
//Redux
import { Provider } from "react-redux";
import store from "../sotre";
import setAuthToken from "../utils/setAuthToken";
import { loadUser } from "../actions/auth";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    console.log("hello");
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <GlobalStyles />
      <Router />
    </Provider>
  );
}

export default App;
