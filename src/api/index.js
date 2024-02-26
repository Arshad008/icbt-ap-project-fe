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
  test: {
    base: "/test",
  },
  appointment: {
    base: "/appointment",
    userList: "/appointment/user/list",
    adminList: "/appointment/admin/list",
    adminConfirm: "/appointment/admin/bookAppointment",
    adminUpdateDoctor: "/appointment/admin/updateDoctor",
    adminUpdateStatus: "/appointment/admin/updateStatus",
    adminUpdateTestData: "/appointment/admin/updateTestData",
    adminGetReportData: "/appointment/admin/getReportData"
  },
};

export const Api = Axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});
