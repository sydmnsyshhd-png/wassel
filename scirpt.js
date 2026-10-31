'use strict';
/* ضع بيانات مشروعك من Supabase: Project Settings → API (المفتاح العام فقط، ليس service_role) */
const SUPA_URL = 'https://xxxx.supabase.co';
const SUPA_KEY = 'ضع_المفتاح_العام_هنا';

const sb = window.supabase.createClient(SUPA_URL, SUPA_KEY);
const $ = s => document.querySelector(s);
const PHONE = /^01[0125]\d{8}$/;
const STEPS = ['تم إنشاء الطلب','تم قبول الطلب','المندوب في طريقه للاستلام','تم استلام الشحنة','الشحنة في الطريق','المندوب اقترب من عنوان التسليم','تم تسليم الشحنة بنجاح'];

function say(el, msg, ok) { el.textContent = msg; el.style.color = ok ? '#1b8a4b' : '#c0392b'; }
const newId = () => 'WSL-' + (100000 + crypto.getRandomValues(new Uint32Array(1))[0] % 900000);

/* القائمة (لو لم تفتح، اسم الكلاس 'open' يجب أن يطابق ما في style.css) */
const mt = $('#menuToggle'), nav = $('#mainNav');
mt.addEventListener('click', () => { const o = nav.classList.toggle('open'); mt.setAttribute('aria-expanded', o); });
nav.addEventListener('click', e => { if (e.target.tagName === 'A') { nav.classList.remove('open'); mt.setAttribute('aria-expanded', 'false'); } });
$('#currentYear').textContent = new Date().getFullYear();

/* إرسال طلب شحن */
$('#orderForm').addEventListener('submit', async e => {
  e.preventDefault();
  const f = e.target, out = $('#orderResult'), btn = f.querySelector('button[type=submit]');
  const name = f.customerName.value.trim(), route = f.route.value.trim();
  const phone = f.phone.value.replace(/[\s-]/g, '');
  if (name.length < 3) return say(out, 'اكتب اسمك بالكامل (3 حروف على الأقل).', 0);
  if (!PHONE.test(phone)) return say(out, 'رقم الموبايل غير صحيح. الصيغة: 01XXXXXXXXX', 0);
  if (route.length < 3) return say(out, 'اكتب خط السير، مثال: القاهرة - الشرقية', 0);

  btn.disabled = true; say(out, 'جاري إرسال الطلب...', 1);
  try {
    for (let i = 0; i < 3; i++) {
      const id = newId();
      const { error } = await sb.from('shipments').insert({ id, doc: { id, name, phone, route, type: f.shipmentType.value, st: 0, created: new Date().toISOString() } });
      if (!error) { f.reset(); $('#trackingNumber').value = id; return say(out, 'تم استلام طلبك ✓ رقم التتبع: ' + id, 1); }
      if (error.code !== '23505') throw error; /* 23505 = رقم مكرر، نعيد المحاولة */
    }
    throw new Error('dup');
  } catch (err) {
    console.error(err); say(out, 'تعذر إرسال الطلب. تأكد من الاتصال وحاول مرة أخرى.', 0);
  } finally { btn.disabled = false; }
});

/* تتبع شحنة */
$('#trackForm').addEventListener('submit', async e => {
  e.preventDefault();
  const out = $('#trackResult'), id = $('#trackingNumber').value.trim().toUpperCase();
  if (!/^WSL-\d{6}$/.test(id)) return say(out, 'صيغة الرقم غير صحيحة، مثال: WSL-123456', 0);
  say(out, 'جاري البحث...', 1);
  const { data, error } = await sb.rpc('track_shipment', { p_id: id });
  if (error) { console.error(error); return say(out, 'تعذر الاتصال بالخدمة. حاول لاحقًا.', 0); }
  if (!data) return say(out, 'لا توجد شحنة بهذا الرقم. راجع الرقم وحاول مرة أخرى.', 0);
  say(out, `الشحنة ${data.id} (${data.route} · ${data.type}): ${STEPS[data.st] ?? 'قيد المعالجة'}`, 1);
});
