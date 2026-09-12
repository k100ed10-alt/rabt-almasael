const DEMO = { id: "1001", pin: "1234" };

const loginScreen = document.getElementById("loginScreen");
const appScreen = document.getElementById("appScreen");
const loginBtn = document.getElementById("loginBtn");
const loginError = document.getElementById("loginError");

const preview = new URLSearchParams(location.search).get("preview");
const modalQ = new URLSearchParams(location.search).get("modal");
if (preview === "1") {
  loginScreen.classList.add("hidden");
  appScreen.classList.remove("hidden");
  if (modalQ === "add") document.getElementById("addModal").classList.remove("hidden");
  if (modalQ === "compare") document.getElementById("compareModal").classList.remove("hidden");
}

function toEn(s) {
  const map = { "\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9" };
  return String(s).replace(/[\u0660-\u0669]/g, (d) => map[d]);
}

function login() {
  const id = toEn(document.getElementById("studentId").value.trim());
  const pin = toEn(document.getElementById("secretPin").value.trim());
  if (id === DEMO.id && pin === DEMO.pin) {
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    loginError.style.display = "none";
  } else {
    loginError.style.display = "block";
  }
}

loginBtn.addEventListener("click", login);
document.getElementById("secretPin").addEventListener("keydown", (e) => {
  if (e.key === "Enter") login();
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  appScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  document.getElementById("secretPin").value = "";
});

document.querySelectorAll(".nav-item[data-view]").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item[data-view]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    document.getElementById("view-" + btn.dataset.view).classList.add("active");
  });
});

function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}
function closeModal(id) {
  document.getElementById(id).classList.add("hidden");
}

document.getElementById("addProblemBtn").addEventListener("click", () => openModal("addModal"));
document.getElementById("compareOpen").addEventListener("click", () => openModal("compareModal"));
const fromList = document.getElementById("openCompareFromList");
if (fromList) fromList.addEventListener("click", () => openModal("compareModal"));

document.querySelectorAll("[data-close]").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
});

document.querySelectorAll(".overlay").forEach((ov) => {
  ov.addEventListener("click", (e) => {
    if (e.target === ov) ov.classList.add("hidden");
  });
});

document.getElementById("saveProblem").addEventListener("click", () => {
  const text = document.getElementById("problemText").value.trim();
  const hasImage = !document.getElementById("imagePreview").classList.contains("hidden");
  closeModal("addModal");
  alert(hasImage ? "تم حفظ المسألة مع الصورة" : "تم حفظ المسألة: " + (text.slice(0, 40) || "بدون نص"));
});

const imageInput = document.getElementById("problemImage");
const imageDrop = document.getElementById("imageDrop");
const imagePreview = document.getElementById("imagePreview");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const removeImage = document.getElementById("removeImage");

function showImage(file) {
  if (!file || !file.type.startsWith("image/")) return;
  const url = URL.createObjectURL(file);
  imagePreview.src = url;
  imagePreview.classList.remove("hidden");
  imagePlaceholder.classList.add("hidden");
  removeImage.classList.remove("hidden");
}

imageDrop.addEventListener("click", () => imageInput.click());
imageInput.addEventListener("change", () => showImage(imageInput.files[0]));

imageDrop.addEventListener("dragover", (e) => {
  e.preventDefault();
  imageDrop.style.borderColor = "#c9a227";
});
imageDrop.addEventListener("dragleave", () => {
  imageDrop.style.borderColor = "#d7c9a6";
});
imageDrop.addEventListener("drop", (e) => {
  e.preventDefault();
  imageDrop.style.borderColor = "#d7c9a6";
  showImage(e.dataTransfer.files[0]);
});

removeImage.addEventListener("click", () => {
  imageInput.value = "";
  imagePreview.src = "";
  imagePreview.classList.add("hidden");
  imagePlaceholder.classList.remove("hidden");
  removeImage.classList.add("hidden");
});

document.querySelectorAll(".filter").forEach((f) => {
  f.addEventListener("click", () => {
    if (f.id === "compareOpen") return;
    document.querySelectorAll(".filter").forEach((x) => x.classList.remove("active"));
    f.classList.add("active");
  });
});
