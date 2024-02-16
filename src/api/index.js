import Axios from 'axios';

export const apiPaths = {
  signUpUser: '/user'
};

export const Api = Axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }
});
