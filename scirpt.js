// ==================================
// WASSEL - MAIN JAVASCRIPT
// ==================================


// 1. SUPABASE CONFIGURATION

const SUPABASE_URL = "YOUR_SUPABASE_URL";

const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const supabaseReady =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_ANON_KEY.includes("YOUR_");

const db =
  supabaseReady && window.supabase
    ? window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
      )
    : null;


// 2. INTRO ANIMATION

window.addEventListener("load", () => {

  setTimeout(() => {

    document
      .getElementById("intro")
      .classList.add("hide");

  }, 1350);

});


// 3. SUCCESS MESSAGE

const toast = document.getElementById("toast");

let toastTimer;

function showToast(
  message = "فريق وصّل هيتواصل معاك قريبًا."
) {

  toast.querySelector("small").textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("show");

  }, 4200);

}


// 4. SAVE FORM DATA

async function saveForm(
  event,
  table,
  successMessage
) {

  event.preventDefault();

  const form = event.currentTarget;

  const button = form.querySelector(
    'button[type="submit"]'
  );

  const original = button.textContent;

  button.disabled = true;

  button.textContent = "جاري الإرسال...";

  const data = Object.fromEntries(
    new FormData(form).entries()
  );

  try {

    if (!db) {

      // وضع المعاينة فقط
      // البيانات لن تُحفظ في قاعدة البيانات.

      console.info(
        "Supabase not configured. Form preview data:",
        data
      );

      showToast(
        "تم اختبار النموذج. اربطي Supabase لتخزين البيانات فعليًا."
      );

    } else {

      const { error } = await db
        .from(table)
        .insert([data]);

      if (error) throw error;

      showToast(successMessage);

    }

    form.reset();

  } catch (error) {

    console.error(error);

    showToast(
      "حصلت مشكلة في الإرسال. راجعي إعدادات Supabase وحاولي مرة تانية."
    );

  } finally {

    button.disabled = false;

    button.textContent = original;

  }

}


// 5. CUSTOMER ORDER FORM

document
  .getElementById("orderForm")
  .addEventListener("submit", (event) => {

    saveForm(
      event,
      "orders",
      "تم استلام طلبك، وهنكلمك لتأكيد التفاصيل."
    );

  });


// 6. MERCHANT REGISTRATION FORM

document
  .getElementById("merchantForm")
  .addEventListener("submit", (event) => {

    saveForm(
      event,
      "stores",
      "طلب تسجيل محلك وصلنا، وهنراجع البيانات ونتواصل معاك."
    );

  });


// 7. DELIVERY RIDER FORM

document
  .getElementById("riderForm")
  .addEventListener("submit", (event) => {

    saveForm(
      event,
      "riders",
      "طلب انضمامك وصلنا، وهنكلمك قريبًا."
    );

  });


// 8. MOBILE MENU

const menuBtn = document.getElementById("menuBtn");

menuBtn.addEventListener("click", () => {

  document
    .querySelector(".topbar nav")
    .classList.toggle("open");

});

document
  .querySelectorAll(".topbar nav a")
  .forEach((link) => {

    link.addEventListener("click", () => {

      document
        .querySelector(".topbar nav")
        .classList.remove("open");

    });

  });


// 9. PRODUCT SEARCH

document
  .getElementById("shopSearch")
  .addEventListener("input", (event) => {

    const query = event.target.value
      .trim()
      .toLowerCase();

    let visible = 0;

    document
      .querySelectorAll(".product-card")
      .forEach((card) => {

        const match = card.textContent
          .toLowerCase()
          .includes(query);

        card.style.display = match ? "" : "none";

        if (match) visible++;

      });

    document
      .getElementById("emptySearch")
      .hidden = visible !== 0;

  });


// ==================================
// 10. BANDUQ ASSISTANT 🐿️
// ==================================

const botPanel = document.getElementById("botPanel");

document
  .getElementById("botLauncher")
  .addEventListener("click", () => {

    botPanel.classList.toggle("open");

  });

document
  .getElementById("botClose")
  .addEventListener("click", () => {

    botPanel.classList.remove("open");

  });


// BANDUQ CHAT FUNCTION

function askBanduq() {

  const input = document.getElementById("botQuestion");

  const question = input.value.trim();

  if (!question) return;

  const messages = document.getElementById("botMessages");


  // رسالة المستخدم

  const user = document.createElement("div");

  user.className = "bot-msg user";

  user.textContent = question;

  messages.appendChild(user);


  // تجهيز الإجابة

  const q = question.toLowerCase();

  let answer =
    "تقدر تملأ نموذج «اطلب أي حاجة» وتكتب كل التفاصيل، وفريق وصّل هيتواصل معاك لتأكيد الطلب.";


  // أسئلة المحلات

  if (
    q.includes("محل") ||
    q.includes("متجر") ||
    q.includes("تسجيل")
  ) {

    answer =
      "لو عندك محل، انزل لقسم «سجّل محلك على وصّل»، واملأ اسم النشاط ورقم التواصل والعنوان ووصف المنتجات. هنراجع طلبك ونتواصل معاك.";

  }


  // أسئلة المندوبين

  else if (
    q.includes("مندوب") ||
    q.includes("شغل") ||
    q.includes("اشتغل")
  ) {

    answer =
      "أهلاً بيك في فريق وصّل! افتح قسم «عايز أشتغل مندوب»، واكتب اسمك ورقمك ووسيلة التوصيل.";

  }


  // أسئلة الأسعار

  else if (
    q.includes("سعر") ||
    q.includes("تكلفة") ||
    q.includes("فلوس")
  ) {

    answer =
      "تكلفة التوصيل بتتحدد حسب تفاصيل الطلب والمسافة، وفريقنا هيأكد معاك السعر قبل تنفيذ الطلب.";

  }


  // أسئلة تتبع الطلبات

  else if (
    q.includes("تتبع") ||
    q.includes("طلب")
  ) {

    answer =
      "بعد إرسال الطلب، فريق وصّل هيتواصل معاك لتأكيده. قريبًا هنضيف تتبع مباشر لكل طلب.";

  }


  // عرض رد بندق

  const reply = document.createElement("div");

  reply.className = "bot-msg";

  reply.textContent = answer;

  messages.appendChild(reply);


  // مسح السؤال

  input.value = "";


  // النزول لآخر المحادثة

  messages.scrollTop = messages.scrollHeight;

}


// زر إرسال رسالة بندق

document
  .getElementById("botSend")
  .addEventListener("click", askBanduq);


// إرسال باستخدام Enter

document
  .getElementById("botQuestion")
  .addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

      askBanduq();

    }

  });


// ==================================
// END OF WASSEL JAVASCRIPT
// ==================================
