import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { GET_ERRORS, SET_CURRENT_USER, USER_LOADING } from "./types";
import customFetch from "../fetch/customFetch";
// Register User
export const registerUser = (userData, history) => async (dispatch) => {
  const res = await customFetch(`/api/users/register`, "POST", userData);
  if (res.status == 200) {
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
    history.push("/login");
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data,
    });
  }
};
// Login - get user token
export const loginUser = (userData) => async (dispatch) => {
  const res = await customFetch(`/api/users/login`, "POST", userData);
  if (res.status == 200 && res.data) {
    // Save to localStorage
    // Set token to localStorage
    const { token } = res.data;
    localStorage.setItem("jwtToken", token);
    // Set token to Auth header
    setAuthToken(token);
    // Decode token to get user data
    const decoded = jwt_decode(token);
    // Set current user
    dispatch(setCurrentUser(decoded));
    dispatch({
      type: GET_ERRORS,
      payload: {},
    });
  } else {
    dispatch({
      type: GET_ERRORS,
      payload: res.data,
    });
  }
};
// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};
// User loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};
// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to empty object {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
