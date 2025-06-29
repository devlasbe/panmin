import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import constants from "@/constants";

const app = initializeApp(constants.firebaseConfig);
const db = getFirestore(app);

let analytics = null;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

interface HistoryData {
  id: string;
  originalText: string;
  translatedText: string;
  mode: "A" | "B";
  timestamp: Date;
}

const useFirebase = () => {
  const saveHistory = async (data: Omit<HistoryData, "id" | "timestamp">) => {
    try {
      const timestamp = new Date();
      const fieldId = timestamp.getTime().toString();

      const newHistoryItem: HistoryData = {
        id: fieldId,
        ...data,
        timestamp,
      };

      const historyRef = doc(db, "panmin", "history");
      const historyDoc = await getDoc(historyRef);

      if (historyDoc.exists()) {
        await updateDoc(historyRef, {
          [fieldId]: newHistoryItem,
          lastUpdated: timestamp,
        });
      } else {
        await setDoc(historyRef, {
          [fieldId]: newHistoryItem,
          lastUpdated: timestamp,
        });
      }

      return { success: true, data: newHistoryItem };
    } catch (error) {
      console.error("Error saving history:", error);
      return { success: false, error };
    }
  };

  const getHistory = async () => {
    try {
      const historyRef = doc(db, "panmin", "history");
      const historyDoc = await getDoc(historyRef);

      if (historyDoc.exists()) {
        const data = historyDoc.data();
        const historyData: HistoryData[] = [];

        Object.keys(data).forEach((key) => {
          if (key !== "lastUpdated" && typeof data[key] === "object") {
            historyData.push(data[key] as HistoryData);
          }
        });

        historyData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        return { success: true, data: historyData };
      } else {
        return { success: true, data: [] };
      }
    } catch (error) {
      console.error("Error getting history:", error);
      return { success: false, error };
    }
  };

  const getHistoryCount = async () => {
    try {
      const historyRef = doc(db, "panmin", "history");
      const historyDoc = await getDoc(historyRef);

      if (historyDoc.exists()) {
        const data = historyDoc.data();
        const fieldCount = Object.keys(data).filter((key) => key !== "lastUpdated").length;

        return { success: true, count: fieldCount };
      } else {
        return { success: true, count: 0 };
      }
    } catch (error) {
      console.error("Error getting history count:", error);
      return { success: false, error };
    }
  };

  return {
    saveHistory,
    getHistory,
    getHistoryCount,
    analytics,
  };
};

export default useFirebase;
