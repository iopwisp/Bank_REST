import { apiCall } from "./client.js";

export const cardsApi = {
  /**
   * GET /api/cards?page=0&size=20
   * Returns Spring Page: { content: CardDTO.Response[], totalElements, totalPages, number, size }
   * CardDTO.Response fields: id, maskedCardNumber, cardHolder, expirationDate,
   *                          status (ACTIVE|BLOCKED|EXPIRED), balance, userId, createdAt, updatedAt
   */
  getAll: (token, page = 0, size = 20) =>
    apiCall("GET", `/api/cards?page=${page}&size=${size}`, null, token),

  /**
   * GET /api/cards/{id}
   */
  getById: (id, token) =>
    apiCall("GET", `/api/cards/${id}`, null, token),

  /**
   * POST /api/cards  — ADMIN ONLY
   * Body: { cardHolder: string, userId: number, initialBalance: number }
   */
  create: ({ cardHolder, userId, initialBalance = 0 }, token) =>
    apiCall("POST", "/api/cards", { cardHolder, userId, initialBalance }, token),

  /**
   * DELETE /api/cards/{id}  — ADMIN ONLY
   * Card must have zero balance
   */
  delete: (id, token) =>
    apiCall("DELETE", `/api/cards/${id}`, null, token),

  /**
   * POST /api/cards/{id}/block
   * Body: { reason: string }  — required, max 500 chars
   */
  block: (id, reason, token) =>
    apiCall("POST", `/api/cards/${id}/block`, { reason }, token),

  /**
   * PUT /api/cards/{id}/status
   * Body: { status: "ACTIVE" | "BLOCKED" | "EXPIRED" }
   */
  updateStatus: (id, status, token) =>
    apiCall("PUT", `/api/cards/${id}/status`, { status }, token),
};
