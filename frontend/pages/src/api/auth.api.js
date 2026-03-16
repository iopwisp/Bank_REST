import { apiCall } from "./client.js";

export const authApi = {
  /**
   * POST /api/auth/login
   * Body: { username, password }
   * Response: { token, type, userId, username, email }
   */
  login: (credentials) =>
    apiCall("POST", "/api/auth/login", credentials),

  /**
   * POST /api/auth/register
   * Body: { username, email, password, firstName, lastName, phoneNumber }
   * Response: { token, type, userId, username, email }
   */
  register: ({ username, email, password, firstName, lastName, phoneNumber }) =>
    apiCall("POST", "/api/auth/register", {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber: phoneNumber || "",
    }),
};
