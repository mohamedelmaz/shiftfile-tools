# دليل التثبيت وتحسين محركات البحث (SEO)

## التثبيت

1. انشر الملفات على أي استضافة ثابتة (GitHub Pages، Hostinger، Netlify، Vercel).
2. تأكد من أن `index.html` في الجذر.
3. فعّل HTTPS.

## SEO

- كل صفحة تحتوي على Title و Meta Description و canonical و OG كاملة.
- sitemap.xml يحتوي على 26 URL بالضبط.
- robots.txt يشير إلى sitemap.xml.
- Schema.org مفعّل في كل صفحة (WebSite، SoftwareApplication، Article).
- الصور تستخدم `alt` نصي.
- الروابط الداخلية نسبية لتعمل محلياً وعند الرفع.

## إضافة أدوات جديدة

1. أنشئ مجلد `tools/your-tool/`.
2. أنشئ `index.html` بنفس الهوية (Header، Footer، SEO، Schema).
3. أنشئ `assets/js/tools/your-tool.js`.
4. أضف البطاقة في `index.html` والقائمة المنسدلة.
5. حدّث `sitemap.xml`.
