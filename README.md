# lexiglobal-site (Prototype)

هذا المشروع نسخة أولية متكاملة تعمل على Vercel (Static + Serverless).
الغرض: نموذج متكامل لتسجيل/دخول مستخدمين (مواطن، محامي، أدمن)، صفحات داخلية، وتحويل أموال محاكاة.

خطوات النشر
1. ادفع الملفات إلى GitHub repo `TOPONElive/lexiglobal-site` ثم استورد المشروع في Vercel أو نفّذ `vercel --prod`.
2. ادف المتغيرات في Vercel (Project → Settings → Environment Variables):
   - ADMIN_EMAIL = top@one.com
   - ADMIN_PASSWORD = Xz01012345
   - JWT_SECRET = (سلسلة عشوائية قوية)
3. بعد ضبط المتغيرات قم بعمل Redeploy من Vercel Dashboard أو ادفع commit جديد.

ملاحظات مهمة
- التخزين الحالي مؤقت (في الذاكرة). للاستمرارية استخدم Supabase/Postgres وبدّل _store.js ليتصل بقاعدة بيانات.
- الدفع الحالي محاكاة فقط. لربط دفع حقيقي استخدم Stripe أو مزود آخر وأضف مفاتيحه كـ ENV.
- لا تخزّن أسرار في GitHub. استخدم Environment Variables في Vercel.


