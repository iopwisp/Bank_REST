import { apiCall } from "./client.js";

export const transferApi = {
  /**
   * POST /api/transfer
   * Body: { fromCardId, toCardId, amount, description? }
   * Response: { transactionId, fromCardId, fromCardMasked, toCardId, toCardMasked,
   *             amount, status, description, createdAt }
   */
  send: ({ fromCardId, toCardId, amount, description = "" }, token) =>
    apiCall(
      "POST",
      "/api/transfer",
      {
        fromCardId:  Number(fromCardId),
        toCardId:    Number(toCardId),
        amount:      Number(amount),
        description,
      },
      token
    ),
};
