import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
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

interface DailyHistoryData {
  date: string; // YYYY-MM-DD 형식
  items: HistoryData[];
  lastUpdated: Date;
}

interface TotalCountData {
  totalCount: number;
  lastUpdated: Date;
}

const useFirebase = () => {
  const getDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // 로컬 시간대 기준 YYYY-MM-DD 형식
  };

  const incrementTotalCount = async () => {
    try {
      const totalCountRef = doc(db, "panmin", "totalCount");
      const totalCountDoc = await getDoc(totalCountRef);

      if (totalCountDoc.exists()) {
        // 기존 카운트가 있으면 +1
        const currentData = totalCountDoc.data() as TotalCountData;
        await setDoc(totalCountRef, {
          totalCount: currentData.totalCount + 1,
          lastUpdated: new Date(),
        });
        return currentData.totalCount + 1;
      } else {
        // 처음이면 1로 시작
        await setDoc(totalCountRef, {
          totalCount: 1,
          lastUpdated: new Date(),
        });
        return 1;
      }
    } catch (error) {
      console.error("Error incrementing total count:", error);
      return 0;
    }
  };

  const getTotalCount = async () => {
    try {
      const totalCountRef = doc(db, "panmin", "totalCount");
      const totalCountDoc = await getDoc(totalCountRef);

      if (totalCountDoc.exists()) {
        const data = totalCountDoc.data() as TotalCountData;
        return { success: true, count: data.totalCount };
      } else {
        return { success: true, count: 0 };
      }
    } catch (error) {
      console.error("Error getting total count:", error);
      return { success: false, error };
    }
  };

  const saveHistory = async (data: Omit<HistoryData, "id" | "timestamp">) => {
    try {
      const timestamp = new Date();
      const dateString = getDateString(timestamp);

      const newHistoryItem: HistoryData = {
        id: timestamp.getTime().toString(), // 간단한 ID 생성
        ...data,
        timestamp,
      };

      const dailyHistoryRef = doc(db, "panmin", `history_${dateString}`);
      const dailyHistoryDoc = await getDoc(dailyHistoryRef);

      if (dailyHistoryDoc.exists()) {
        // 기존 날짜 문서가 있으면 아이템 추가
        const existingData = dailyHistoryDoc.data() as DailyHistoryData;
        const updatedItems = [...existingData.items, newHistoryItem];

        await setDoc(dailyHistoryRef, {
          date: dateString,
          items: updatedItems,
          lastUpdated: timestamp,
        });
      } else {
        // 새로운 날짜 문서 생성
        await setDoc(dailyHistoryRef, {
          date: dateString,
          items: [newHistoryItem],
          lastUpdated: timestamp,
        });
      }

      // 총 번역 횟수 +1
      await incrementTotalCount();

      return { success: true, data: newHistoryItem };
    } catch (error) {
      console.error("Error saving history:", error);
      return { success: false, error };
    }
  };

  const getHistory = async (days: number = 7) => {
    try {
      const historyData: HistoryData[] = [];
      const today = new Date();

      // 최근 N일간의 데이터 조회
      for (let i = 0; i < days; i++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - i);
        const dateString = getDateString(targetDate);

        const dailyHistoryRef = doc(db, "panmin", `history_${dateString}`);
        const dailyHistoryDoc = await getDoc(dailyHistoryRef);

        if (dailyHistoryDoc.exists()) {
          const data = dailyHistoryDoc.data() as DailyHistoryData;
          historyData.push(...data.items);
        }
      }

      // 최신순으로 정렬
      historyData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return { success: true, data: historyData };
    } catch (error) {
      console.error("Error getting history:", error);
      return { success: false, error };
    }
  };

  return {
    saveHistory,
    getHistory,
    getTotalCount,
    analytics,
  };
};

export default useFirebase;
