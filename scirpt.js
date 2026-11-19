/* =========================
   وصّل | Fixes
   الصق هذا الجزء في آخر ملف الـ CSS (بعد كل الأكواد الموجودة)
   ========================= */

/* 1) textarea كان ناقص من إعادة ضبط الخط (لو حقل العنوان textarea) */
textarea { font: inherit; }

/* 2) دعم Safari للـ blur في الهيدر */
.site-header {
  -webkit-backdrop-filter: blur(14px);
}

/* 3) الـ checkbox جوه .form-row كان بياخد padding/border/shadow الخاصة بحقول النص */
.form-row input[type="checkbox"],
.form-row input[type="file"] {
  padding: 0;
  box-shadow: none;
}
.worker-form input[type="file"] {
  padding: 11px;
}

/* 4) textarea بنفس شكل باقي الحقول */
.form-row textarea,
.worker-form textarea {
  width: 100%;
  min-width: 0;
  min-height: 90px;
  padding: 12px 14px;
  color: var(--dark);
  background: #fcfdfb;
  border: 1px solid var(--line);
  border-radius: 11px;
  outline: none;
  resize: vertical;
  font-size: 13px;
  transition: border-color .2s ease, box-shadow .2s ease;
}
.form-row textarea:focus,
.worker-form textarea:focus {
  border-color: var(--green-deep);
  box-shadow: 0 0 0 3px rgba(107, 158, 58, .13);
}

/* 5) زر "outline" أبيض، فبيختفي جوه صندوق العقد الفاتح */
.contract-box .button-outline {
  color: var(--dark);
  border-color: rgba(16, 43, 38, .35);
}
.contract-box .button-outline:hover {
  background: rgba(16, 43, 38, .06);
}

/* 6) مسافة الزر في اختيار الملف تتماشى مع اتجاه الصفحة (RTL/LTR) */
.worker-form input[type="file"]::file-selector-button {
  margin-left: 0;
  margin-inline-end: 10px;
}

/* 7) إضافة رابط "انضم لنا" في القائمة كانت بتزحم الهيدر في الشاشات المتوسطة */
@media (max-width: 900px) {
  .main-nav { gap: 18px; font-size: 13px; }
}

/* 8) الموبايل: لازم حجم الخط 16px في الحقول، غير كده iPhone بيعمل zoom تلقائي عند الضغط */
@media (max-width: 700px) {
  .form-row input,
  .form-row select,
  .form-row textarea,
  .worker-form input:not([type="checkbox"]):not([type="file"]),
  .worker-form select,
  .worker-form textarea {
    font-size: 16px;
  }
}
