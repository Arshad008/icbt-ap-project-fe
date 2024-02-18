import Axios from "axios";

export const apiPaths = {
  login: "/login",
  user: {
    base: "/user",
  },
  staff: {
    base: "/staff",
    updateStatus: "/staff/updateStatus",
  },
};

export const Api = Axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
