import axios from "axios";
import ToastMessage from "./toastMessage";
import localforage from "localforage";
// export const baseURL = `http://localhost:4000/print-job/`;
export const baseURL = `https://printing-job-backend.onrender.com/`;

const redirectUser = async (response) => {
  console.log(response);
  let { origin } = window.location;
  let { pathname } = window.location;
  if (response.status === 401) {
    await ToastMessage(
      "error",
      response.data?.message ||
        "Login as expired, kindly login again to proceed"
    );
    setTimeout(async () => {
      await localforage.clear();
      if (pathname.includes("/user/"))
        return (window.location.href = `${origin}/login`);
      if (pathname.includes("/admin/"))
        return (window.location.href = `${origin}/admin/login`);
    }, 2000);
  }
};

export const generalGetRequest = async (url, token) => {
  try {
    return await axios.get(url, {
      headers: {
        // Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    console.log(e);
    if (e?.response.status === 401) return redirectUser(e?.response);
    return ToastMessage(
      "error",
      typeof e?.response?.data?.message === "object"
        ? e?.response?.data?.message.join(",")
        : e?.response?.data?.message
    );
  }
};

export const postRequest = async (endpoint, payload) => {
  try {
    return await axios.post(`${baseURL}${endpoint}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  } catch (e) {
    console.log(e);
    if (e?.response.status === 401) return redirectUser(e?.response);
    return ToastMessage(
      "error",
      typeof e?.response?.data?.message === "object"
        ? e?.response?.data?.message.join(",")
        : e?.response?.data?.message
    );
  }
};
export const putRequest = async (endpoint, payload) => {
  try {
    return await axios.put(`${baseURL}${endpoint}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  } catch (e) {
    console.log(e);
    if (e?.response.status === 401) return redirectUser(e?.response);
    return ToastMessage(
      "error",
      typeof e?.response?.data?.message === "object"
        ? e?.response?.data?.message.join(",")
        : e?.response?.data?.message
    );
  }
};

export const deleteRequest = async (endpoint, payload) => {
  try {
    return await axios.delete(`${baseURL}${endpoint}/${payload}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    });
  } catch (e) {
    console.log(e);
    if (e?.response.status === 401) return redirectUser(e?.response);
    return ToastMessage(
      "error",
      typeof e?.response?.data?.message === "object"
        ? e?.response?.data?.message.join(",")
        : e?.response?.data?.message
    );
  }
};

export const getRequest = async (endpoint, payload) => {
  try {
    return await axios.get(
      `${baseURL}${endpoint}${payload ? "/" + payload : ""}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
  } catch (e) {
    console.log(e);
    if (e?.response.status === 401) return redirectUser(e?.response);
    return ToastMessage(
      "error",
      typeof e?.response?.data?.message === "object"
        ? e?.response?.data?.message.join(",")
        : e?.response?.data?.message
    );
  }
};