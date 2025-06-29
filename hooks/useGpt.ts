import OpenAI from "openai";
import { useState } from "react";
import constants from "@/constants";
import useFirebase from "./useFirebase";

const openai = new OpenAI({
  apiKey: constants.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

type getGptRequestType = {
  // 모드 A: 한국어 → 판교 사투리
  // 모드 B: 판교 사투리 → 한국어
  mode: "A" | "B";
  text: string;
};

export default function useGpt() {
  const [isLoading, setIsLoading] = useState(false);
  const { saveHistory } = useFirebase();

  const getGptResponse = async ({ mode, text }: getGptRequestType) => {
    try {
      setIsLoading(true);
      const prompt = constants.env.GPT_PROMPT;
      if (!prompt) return "GPT_PROMPT is not set";

      const response = await openai.chat.completions.create({
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: prompt.replace("{mode}", mode).replace("{user_input}", text) },
        ],
        model: "gpt-4.1-mini",
      });

      const translatedText = response.choices[0].message.content;

      // Firestore에 히스토리 저장
      if (translatedText && translatedText !== "에러가 발생했습니다.") {
        await saveHistory({
          originalText: text,
          translatedText: translatedText,
          mode: mode,
        });
      }

      return translatedText;
    } catch {
      return "에러가 발생했습니다.";
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getGptResponse };
}
