import api from "./api";

export const usersAPI = {
  getAllUsers: () => api.get("users/"),

  getUserByID: (id) => api.get(`users/${id}`),

  createUser: (userData) => api.post("users/", userData),

  updateUser: (id, userData) => api.put(`users/${id}`, userData),

  deleteUserByID: (id) => api.delete(`users/${id}`),
};
