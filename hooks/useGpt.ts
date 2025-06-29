import OpenAI from "openai";
import { useState } from "react";
import constants from "@/constants";

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
      return response.choices[0].message.content;
    } catch {
      return "에러가 발생했습니다.";
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, getGptResponse };
}
