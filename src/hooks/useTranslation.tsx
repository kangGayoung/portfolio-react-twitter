import { languageState } from "atom";
import { useRecoilValue } from "recoil";
import TRANSLATIONS from "constants/language";

export default function useTranslation() {
    const lang = useRecoilValue(languageState); //useRecoilValue 값만 가져올때 사용

    return (key: keyof typeof TRANSLATIONS) => {
        return TRANSLATIONS[key][lang];
    };
}