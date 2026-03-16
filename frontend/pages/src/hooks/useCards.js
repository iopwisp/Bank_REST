import { useState, useCallback } from "react";
import { cardsApi } from "../api/index.js";

/**
 * Spring Page response shape:
 * { content: Card[], totalElements, totalPages, number, size, ... }
 */
export function useCards(token) {
  const [cards,         setCards]        = useState([]);
  const [page,          setPage]         = useState({ number: 0, totalPages: 1, totalElements: 0 });
  const [loading,       setLoading]      = useState(false);
  const [actionLoading, setAction]       = useState(null);

  const load = useCallback(async (pageNumber = 0, pageSize = 20) => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await cardsApi.getAll(token, pageNumber, pageSize);
      // Handle both paginated { content: [...] } and plain array responses
      if (Array.isArray(data)) {
        setCards(data);
      } else {
        setCards(data.content ?? []);
        setPage({
          number:        data.number        ?? 0,
          totalPages:    data.totalPages    ?? 1,
          totalElements: data.totalElements ?? (data.content?.length ?? 0),
        });
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  /**
   * ADMIN ONLY — POST /api/cards
   * @param {{ cardHolder: string, userId: number, initialBalance?: number }} params
   */
  const create = async ({ cardHolder, userId, initialBalance = 0 }) => {
    setAction("create");
    try {
      await cardsApi.create({ cardHolder, userId, initialBalance }, token);
      await load();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    } finally {
      setAction(null);
    }
  };

  /**
   * ADMIN ONLY — DELETE /api/cards/{id}
   * Card must have zero balance.
   */
  const remove = async (id) => {
    setAction(`del-${id}`);
    try {
      await cardsApi.delete(id, token);
      await load();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    } finally {
      setAction(null);
    }
  };

  /**
   * POST /api/cards/{id}/block
   * @param {number} id
   * @param {string} reason — required by backend, max 500 chars
   */
  const block = async (id, reason) => {
    setAction(`block-${id}`);
    try {
      await cardsApi.block(id, reason, token);
      await load();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    } finally {
      setAction(null);
    }
  };

  /**
   * PUT /api/cards/{id}/status
   * @param {number} id
   * @param {"ACTIVE"|"BLOCKED"|"EXPIRED"} status
   */
  const updateStatus = async (id, status) => {
    setAction(`status-${id}`);
    try {
      await cardsApi.updateStatus(id, status, token);
      await load();
      return { ok: true };
    } catch (e) {
      return { ok: false, message: e.message };
    } finally {
      setAction(null);
    }
  };

  return { cards, page, loading, actionLoading, load, create, remove, block, updateStatus };
}
