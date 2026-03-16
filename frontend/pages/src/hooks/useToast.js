import { useState, useCallback } from "react";

export function useToast() {
  const [toast, setToast] = useState(null);

  const notify = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const dismiss = useCallback(() => setToast(null), []);

  return { toast, notify, dismiss };
}
