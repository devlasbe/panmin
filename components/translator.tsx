"use client";

import useGpt from "@/hooks/useGpt";
import Image from "next/image";
import { useState } from "react";
import { Loader } from "@lasbe/loader";

const LANGUAGE: Record<string, "한국어" | "판교 사투리"> = {
  ko: "한국어",
  pg: "판교 사투리",
} as const;

type LanguageType = (typeof LANGUAGE)[keyof typeof LANGUAGE];

type TranslateType = {
  from: LanguageType;
  to: LanguageType;
  text: string;
  result: string;
};

const Translator = () => {
  const { isLoading, getGptResponse } = useGpt();
  const [translate, setTranslate] = useState<TranslateType>({
    from: LANGUAGE.pg,
    to: LANGUAGE.ko,
    text: "",
    result: "",
  });

  const handleChangeLanguage = () => {
    setTranslate((prev) => ({
      ...prev,
      from: prev.from === LANGUAGE.ko ? LANGUAGE.pg : LANGUAGE.ko,
      to: prev.to === LANGUAGE.ko ? LANGUAGE.pg : LANGUAGE.ko,
    }));
  };

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranslate((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const handleClickCopy = async () => {
    if (translate.result) {
      await navigator.clipboard.writeText(translate.result);
      alert("결과가 복사되었습니다.");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!translate.text) return;
    getGptResponse({ mode: translate.from === LANGUAGE.ko ? "A" : "B", text: translate.text }).then((response) => {
      if (response) setTranslate((prev) => ({ ...prev, result: response }));
    });
  };

  return (
    <form className="flex flex-1 flex-col border rounded-md overflow-hidden" onSubmit={handleSubmit}>
      <div className="flex items-center p-4 border-b">
        <p className="flex-1">{translate.from}</p>
        <button className="active:opacity-50 cursor-pointer" type="button" onClick={handleChangeLanguage}>
          <Image src="/path.svg" alt="path" width={24} height={24} />
        </button>
        <p className="flex-1 text-right ">{translate.to}</p>
      </div>
      <div className="flex flex-1  flex-col md:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 p-4 md:border-r">
            <textarea
              className="w-full h-full resize-none focus-visible:outline-none"
              value={translate.text}
              onChange={handleChangeText}
              placeholder="오전 미팅 했을 때 세커티를 디벨롭한거 매리지체크해서 리셀해주시고 이슈 메컵했을 때 락앤 주세요"
            />
          </div>
          <div className="p-4 md:p-0 border-t border-b md:border-b-0">
            <button
              className={`w-full h-full p-4 border rounded-full md:rounded-none border-blue-600 bg-blue-500 text-white ${
                isLoading ? "opacity-50" : ""
              }`}
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? <Loader isLoading={isLoading} size="lg" color="#fff" /> : "번역 얼라인하기"}
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          {isLoading ? (
            <div className={`flex flex-1 justify-center items-center p-4`}>
              <Loader isLoading={isLoading} size="lg" />
            </div>
          ) : (
            <div className={`flex-1 p-4`}>{translate.result}</div>
          )}

          <div className="p-4 md:p-0 border-t ">
            <button
              className="w-full h-full p-4 border rounded-full md:rounded-none border-green-600 bg-green-500 text-white"
              type="button"
              onClick={handleClickCopy}
            >
              복사하기
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default Translator;
