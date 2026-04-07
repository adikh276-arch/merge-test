import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/mission/ui/select";
import { useEffect } from 'react';

const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'id', name: 'Indonesia' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'ko', name: '한국어' },
    { code: 'ru', name: 'Русский' },
    { code: 'it', name: 'Italiano' },
    { code: 'pl', name: 'Polski' },
    { code: 'th', name: 'ไทย' },
    { code: 'tl', name: 'Filipino' }
];

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const lang = params.get("mission.lang");
        if (lang && languages.some(l => l.code === lang)) {
            i18n.changeLanguage(lang);
            localStorage.setItem('language', lang);
        } else {
            const savedLang = localStorage.getItem('language');
            if (savedLang && languages.some(l => l.code === savedLang)) {
                i18n.changeLanguage(savedLang);
            }
        }
    }, [i18n]);

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <div className="absolute top-4 right-4 z-50">
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[130px] bg-background/50 backdrop-blur-sm border-border">
                    <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                    {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

export default LanguageSelector;
