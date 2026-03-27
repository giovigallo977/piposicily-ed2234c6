import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

const STORAGE_KEY = "pipo-card-expansions";
const GATE_THRESHOLD = 3;

export const useCardGate = () => {
  const { user } = useAuth();

  const [expansionCount, setExpansionCount] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY) || "0", 10);
    } catch {
      return 0;
    }
  });

  const [gateModalOpen, setGateModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(expansionCount));
    } catch {}
  }, [expansionCount]);

  const shouldGate = !user && expansionCount >= GATE_THRESHOLD;

  const onBeforeExpand = useCallback((): boolean => {
    if (user) return true; // logged in, always allow
    if (expansionCount >= GATE_THRESHOLD) {
      setGateModalOpen(true);
      return false; // block expansion
    }
    setExpansionCount((c) => c + 1);
    // Check if this expansion hits the threshold (will gate on next attempt)
    if (expansionCount + 1 >= GATE_THRESHOLD) {
      // Allow this last one but don't gate yet
    }
    return true;
  }, [user, expansionCount]);

  return { shouldGate, onBeforeExpand, gateModalOpen, setGateModalOpen };
};
