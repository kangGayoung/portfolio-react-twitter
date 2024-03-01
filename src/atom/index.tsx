import {atom} from "recoil";

export type LanguageType = "ko" | "en";

// 다국어처리 atom
// localStorage 해당 값을 영속적으로 저장(새로고침해도 사라지지 않음)
export const languageState = atom<LanguageType>({
    key: "language",
    default: localStorage.getItem("language") as LanguageType || "ko",
});