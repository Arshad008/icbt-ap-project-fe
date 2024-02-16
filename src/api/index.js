import Axios from 'axios';

export const apiPaths = {
  login: '/login',
  user: {
    base: '/user',
    signUpUser: '/user',
  },
};

export const Api = Axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});
