"use client";

import useGpt from "@/hooks/useGpt";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
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

const description = {
  [LANGUAGE.ko]:
    "제가 후속 조치할 테니 저희 쪽으로 업무 넘겨주시고요, 감성 포인트가 부족해 보여서 저희 쪽에서 좀 더 개발해보고 계속 커뮤니케이션할게요. VIP께서 매우 중요하게 체크 중인 이슈이니 최대한 빨리 진행하겠습니다. 매주 상황 정리해서 직접 미팅 드릴게요. 역할과 책임이 애매한 부분 있으면 참조로 걸어서 전달 부탁드리고, 제가 판단해 담당 배정하거나 경영진에 보고하겠습니다.",
  [LANGUAGE.pg]:
    "제가 follow-up할테니 저희쪽으로 Toss해주세요. wow factor가 없는 것 같아서 저희쪽에서 좀 더 develop해보고 계속 comm할게요. vip께서 아주 중점적으로 보고 있는 issue니깐 asap 으로 가겠습니다. 제가 위클리로 wrap-up해서 직접 meeting할게요. r&r 애매한게 있으면 cc로 걸어서 forward해주세요. 제가 판단해서 assign하거나 c레벨로 raising하겠습니다.",
};

const Translator = () => {
  const { isLoading, getGptResponse } = useGpt();
  const [translate, setTranslate] = useState<TranslateType>({
    from: LANGUAGE.pg,
    to: LANGUAGE.ko,
    text: "",
    result: "",
  });
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [cooldown]);

  const handleChangeLanguage = useCallback(() => {
    setTranslate((prev) => ({
      ...prev,
      from: prev.from === LANGUAGE.ko ? LANGUAGE.pg : LANGUAGE.ko,
      to: prev.to === LANGUAGE.ko ? LANGUAGE.pg : LANGUAGE.ko,
    }));
  }, []);

  const handleChangeText = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTranslate((prev) => ({
      ...prev,
      text: e.target.value,
    }));
  };

  const handleClickCopy = useCallback(async () => {
    if (translate.result) {
      await navigator.clipboard.writeText(translate.result);
      alert("결과가 복사되었습니다.");
    }
  }, [translate.result]);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!translate.text || cooldown > 0) return;
      getGptResponse({ mode: translate.from === LANGUAGE.ko ? "A" : "B", text: translate.text }).then((response) => {
        if (response) {
          setTranslate((prev) => ({ ...prev, result: response }));
          setCooldown(5); // 5초 쿨다운 시작
        }
      });
    },
    [translate.text, translate.from, cooldown, getGptResponse]
  );

  const getButtonText = useCallback(() => {
    if (isLoading) return "번역 중...";
    if (cooldown > 0) return `번역 얼라인하기 (${cooldown}s)`;
    return "번역 얼라인하기";
  }, [isLoading, cooldown]);

  const isButtonDisabled = isLoading || cooldown > 0;

  return (
    <form className="flex flex-1 flex-col border rounded-md" onSubmit={handleSubmit}>
      <div className="flex items-center p-4 border-b">
        <p className="flex-1">{translate.from}</p>
        <button className="active:opacity-50 cursor-pointer" type="button" onClick={handleChangeLanguage}>
          <Image src="/path.svg" alt="path" width={24} height={24} />
        </button>
        <p className="flex-1 text-right ">{translate.to}</p>
      </div>
      <div className="flex flex-1 flex-col md:flex-row">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 p-4 md:border-r">
            <textarea
              className="flex-1 w-full resize-none focus-visible:outline-none"
              value={translate.text}
              onChange={handleChangeText}
              placeholder={description[translate.from]}
            />
          </div>
          <div className="p-4 md:p-0 border-t border-b md:border-b-0">
            <button
              className={`w-full h-full p-4 border rounded-full md:rounded-none border-blue-600 bg-blue-500 text-white active:opacity-50 ${
                isButtonDisabled ? "opacity-50" : ""
              }`}
              disabled={isButtonDisabled}
              type="submit"
            >
              {isLoading ? <Loader isLoading={isLoading} size="lg" color="#fff" /> : getButtonText()}
            </button>
          </div>
        </div>
        <div className="flex flex-1 flex-col overflow-y-hidden">
          {isLoading ? (
            <div className={`flex flex-1 justify-center items-center p-4`}>
              <Loader isLoading={isLoading} size="lg" />
            </div>
          ) : (
            <div className={`flex-1 p-4 overflow-y-scroll`}>
              <p>{translate.result || description[translate.to]}</p>
            </div>
          )}

          <div className="p-4 md:p-0 border-t ">
            <button
              className="w-full h-full p-4 border rounded-full md:rounded-none border-green-600 bg-green-500 text-white active:opacity-50"
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
