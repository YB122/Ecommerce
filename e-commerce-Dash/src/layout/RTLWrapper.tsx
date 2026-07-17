import * as React from 'react';
import { useLocale } from 'react-admin';

export const RTLWrapper = ({ children }: { children: React.ReactNode }) => {
    const locale = useLocale();
    const isRTL = locale === 'ar';

    React.useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
    }, [isRTL, locale]);

    return <div dir={isRTL ? 'rtl' : 'ltr'}>{children}</div>;
};