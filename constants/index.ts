const url = "https://panmin.vercel.app";
const title = "판민정음:판교 사투리 번역기";
const description = "판교 사투리 번역기 판민정음과 함께라면 스타트업도 걱정 없어!";

const env = {
  GPT_PROMPT: process.env.NEXT_PUBLIC_GPT_PROMPT,
  OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  VERIFICATION_GOOGLE: process.env.VERIFICATION_GOOGLE,
  VERIFICATION_NAVER: process.env.VERIFICATION_NAVER,
  FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_MESSAGING_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_ID,
  FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseConfig = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: `${env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: env.FIREBASE_PROJECT_ID,
  storageBucket: `${env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: env.FIREBASE_MESSAGING_ID,
  appId: env.FIREBASE_APP_ID,
  measurementId: env.FIREBASE_MEASUREMENT_ID,
};

const profile = {
  email: "devlasbe@gmail.com",
  github: "https://github.com/devlasbe",
  instagram: "https://www.instagram.com/lasbe_/",
  blog: "https://lasbe.tistory.com/",
};

const metaData = {
  title,
  description,
  keywords: "판교 사투리, 번역기, 판교 사투리 번역, 판교 사투리 번역기",
  openGraph: {
    title,
    description,
    siteName: title,
    locale: "ko_KR",
    type: "website",
    url,
    images: {
      url: "/og-image.jpg",
    },
  },
  verification: {
    google: env.VERIFICATION_GOOGLE || "",
    other: {
      "naver-site-verification": env.VERIFICATION_NAVER || "",
    },
  },
};

const constants = {
  url,
  title,
  description,
  env,
  metaData,
  profile,
  firebaseConfig,
};

export default constants;
