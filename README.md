# 📋 تطبيق إدارة المهام

تطبيق ويب بسيط وسهل الاستخدام لإدارة مهامك اليومية

## ✨ الميزات

- ✅ إضافة مهام جديدة
- ✅ تعديل المهام
- ✅ حذف المهام
- ✅ تحديد حالة المهمة (مكتملة/غير مكتملة)
- ✅ واجهة مستخدم بسيطة وجميلة

## 🛠️ التكنولوجيا المستخدمة

### Backend
- Node.js
- Express.js
- TypeScript
- SQLite / MongoDB

### Frontend
- React
- TypeScript
- Axios
- Tailwind CSS

## 📦 التثبيت والتشغيل

### المتطلبات
- Node.js (v14 أو أعلى)
- npm أو yarn

### خطوات التثبيت

1. استنساخ المستودع:
```bash
git clone https://github.com/mariamh2244-svg/task-manager-app.git
cd task-manager-app
```

2. تثبيت المكتبات:
```bash
npm install
```

3. تشغيل المشروع:
```bash
# تشغيل Backend و Frontend معاً
npm run dev

# أو تشغيل كل واحد على حدة
npm run dev:backend  # في terminal آخر
npm run dev:frontend # في terminal آخر
```

4. افتح المتصفح واذهب إلى:
```
http://localhost:3000
```

## 📁 هيكل المشروع

```
task-manager-app/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── app.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 🚀 الاستخدام

### إضافة مهمة
1. أدخل نص المهمة في حقل الإدخال
2. اضغط على زر "إضافة"

### تعديل مهمة
- اضغط على أيقونة التعديل بجانب المهمة

### حذف مهمة
- اضغط على أيقونة الحذف

### تحديد إكمال المهمة
- اضغط على checkbox بجانب المهمة

## 📝 API الأساسي

### المهام (Tasks)

**الحصول على جميع المهام**
```
GET /api/tasks
```

**إضافة مهمة جديدة**
```
POST /api/tasks
Body: { "title": "اسم المهمة", "description": "وصف" }
```

**تحديث مهمة**
```
PUT /api/tasks/:id
Body: { "title": "...", "completed": true/false }
```

**حذف مهمة**
```
DELETE /api/tasks/:id
```

## 📄 الترخيص

MIT License

## 👤 المطور

mariamh2244-svg

---

**استمتع بإدارة مهامك! 🎉**