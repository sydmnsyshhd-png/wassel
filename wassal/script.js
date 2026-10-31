const SUPABASE_URL = "https://kwrpratouddgmthkjvoo.supabase.co";
const SUPABASE_KEY = "sb_publishable_CYKAsh7RdcT7ZC5DRKZMHg_apUveSe1";

const trackForm = document.getElementById("trackForm");
const trackResult = document.getElementById("trackResult");

trackForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const number = document
    .getElementById("trackingNumber")
    .value.trim();

  trackResult.textContent =
    "رقم الشحنة: " + number +
    " — دي نسخة تجريبية. تتبع الشحنات الحقيقي يحتاج ربط بنظام الشركة.";
});

const orderForm = document.getElementById("orderForm");
const orderResult = document.getElementById("orderResult");

orderForm.addEventListener("submit", async function(event) {
  event.preventDefault();
const result = document.getElementById("orderResult");
const parts = document.getElementById("route").value.split(/[-–،,]/);

const order = {
  name: document.getElementById("customerName").value.trim(),
  phone: document.getElementById("phone").value.trim(),
  from_city: (parts[0] || "").trim(),
  to_city: (parts[1] || "").trim(),
  shipment_type: document.getElementById("shipmentType").value
};

try {
  const res = await fetch(SUPABASE_URL + "/rest/v1/shipments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(order)
  });

  if (!res.ok) throw new Error(await res.text());

  result.textContent = "تم إرسال طلبك بنجاح ✅";
  event.target.reset();
} catch (err) {
  console.error(err);
  result.textContent = "حصلت مشكلة، حاولي تاني.";
}
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const route = document.getElementById("route").value.trim();
  const type = document.getElementById("shipmentType").value;

  if (!name || !phone || !route) {
    orderResult.textContent = "من فضلك املي كل البيانات.";
    return;
  }

  orderResult.textContent =
    "تم تجهيز بيانات طلبك بنجاح. استقبال الطلبات الحقيقي يحتاج ربط الموقع بنظام الشركة.";
});