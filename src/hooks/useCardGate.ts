import { useState, useCallback, useEffect } from "react";
import { trackEvent } from "@/lib/trackEvent";

export type GateSource = "hotspot_gate" | "collection_gate";

const HOTSPOT_KEY = "pipo-hotspot-expansions";
const COLLECTION_KEY = "pipo-collection-views";
const EMAIL_PROVIDED_KEY = "pipo-email-provided";

const HOTSPOT_THRESHOLD = 2; // allow 2, block on 3rd
const COLLECTION_THRESHOLD = 1; // allow 1, block on 2nd

const readCount = (key: string): number => {
  try { return parseInt(localStorage.getItem(key) || "0", 10); }
  catch { return 0; }
};

const writeCount = (key: string, val: number) => {
  try { localStorage.setItem(key, String(val)); } catch {}
};

export const isEmailProvided = (): boolean => {
  try { return localStorage.getItem(EMAIL_PROVIDED_KEY) === "true"; }
  catch { return false; }
};

export const markEmailProvided = () => {
  try { localStorage.setItem(EMAIL_PROVIDED_KEY, "true"); } catch {}
};

export const useCardGate = () => {
  const [hotspotCount, setHotspotCount] = useState<number>(() => readCount(HOTSPOT_KEY));
  const [collectionCount, setCollectionCount] = useState<number>(() => readCount(COLLECTION_KEY));
  const [emailDone, setEmailDone] = useState<boolean>(() => isEmailProvided());
  const [gateModalOpen, setGateModalOpen] = useState(false);

  useEffect(() => { writeCount(HOTSPOT_KEY, hotspotCount); }, [hotspotCount]);
  useEffect(() => { writeCount(COLLECTION_KEY, collectionCount); }, [collectionCount]);

  const isUnlocked = emailDone;

  /** Call before expanding a hotspot card. Returns true if allowed. */
  const onBeforeExpand = useCallback((): boolean => {
    if (isUnlocked) return true;
    if (hotspotCount >= HOTSPOT_THRESHOLD) {
      trackEvent("mail_wall_mostrato");
      setGateModalOpen(true);
      return false;
    }
    setHotspotCount((c) => c + 1);
    trackEvent("hotspot_aperti");
    return true;
  }, [isUnlocked, hotspotCount]);

  /** Call before navigating to a collection. Returns true if allowed. */
  const onBeforeCollectionView = useCallback((): boolean => {
    if (isUnlocked) return true;
    trackEvent("itinerari_cliccati");
    if (collectionCount >= COLLECTION_THRESHOLD) {
      trackEvent("mail_wall_mostrato");
      setGateModalOpen(true);
      return false;
    }
    setCollectionCount((c) => c + 1);
    return true;
  }, [isUnlocked, collectionCount]);

  /** Whether the current collection should show inline block (2nd+ collection for non-unlocked users) */
  const shouldShowCollectionBlock = !isUnlocked && collectionCount >= COLLECTION_THRESHOLD;

  const onEmailProvided = useCallback(() => {
    markEmailProvided();
    setEmailDone(true);
    setGateModalOpen(false);
  }, []);

  return {
    isUnlocked,
    onBeforeExpand,
    onBeforeCollectionView,
    shouldShowCollectionBlock,
    gateModalOpen,
    setGateModalOpen,
    onEmailProvided,
  };
};
