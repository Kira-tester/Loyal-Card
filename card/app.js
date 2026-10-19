const STAMP_TARGET = 10;
const STORAGE_KEY = "aaya-resin-art-demo-stamps";
const COOLDOWN_MS = 4 * 60 * 60 * 1000;

const stampGrid = document.querySelector("#stamp-grid");
const dialogStamps = document.querySelector("#dialog-stamps");
const stampCount = document.querySelector("#stamp-count");
const stampLabel = document.querySelector("#stamp-label");
const cardReward = document.querySelector("#card-reward");
const dialog = document.querySelector("#card-dialog");
const progressCount = document.querySelector("#dialog-progress-count");
const progressFill = document.querySelector("#progress-fill");
const rewardStatus = document.querySelector("#reward-status");
const addStampButton = document.querySelector("#demo-stamp-button");
const toast = document.querySelector("#toast");
let toastTimer;

function readDemoState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const count = Number(saved.count);
    const lastStampAt = Number(saved.lastStampAt);
    return {
      count: Number.isInteger(count) ? Math.max(0, Math.min(STAMP_TARGET, count)) : 0,
      lastStampAt: Number.isFinite(lastStampAt) ? lastStampAt : 0,
    };
  } catch (error) {
    console.warn("Could not read the demo loyalty card from this browser.", error);
    return { count: 0, lastStampAt: 0 };
  }
}

function writeDemoState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Could not save the demo loyalty card in this browser.", error);
    showToast("Your browser could not save this demo card.");
    return false;
  }
}

function renderStamps(container, count) {
  container.replaceChildren();
  for (let index = 0; index < STAMP_TARGET; index += 1) {
    const slot = document.createElement("span");
    const isReward = index === STAMP_TARGET - 1;
    slot.className = `stamp-slot${index < count ? " filled" : ""}${isReward ? " reward-slot" : ""}`;
    slot.textContent = index < count ? "✳" : isReward ? "✧" : "·";
    slot.setAttribute("aria-hidden", "true");
    container.append(slot);
  }
}

function render() {
  const state = readDemoState();
  const isReady = state.count >= STAMP_TARGET;
  renderStamps(stampGrid, state.count);
  renderStamps(dialogStamps, state.count);
  stampGrid.setAttribute("aria-label", `${state.count} of ${STAMP_TARGET} visits collected`);
  stampCount.textContent = String(state.count);
  stampLabel.textContent = isReady ? "visits collected" : `of ${STAMP_TARGET} visits`;
  cardReward.innerHTML = isReady ? "Your treat is ready <span aria-hidden=\"true\">✦</span>" : "10th visit = a treat <span aria-hidden=\"true\">✳</span>";
  progressCount.textContent = `${state.count} / ${STAMP_TARGET}`;
  progressFill.style.width = `${(state.count / STAMP_TARGET) * 100}%`;
  rewardStatus.textContent = isReady ? "A treat is ready for you in this demo!" : `${STAMP_TARGET - state.count} more ${STAMP_TARGET - state.count === 1 ? "stamp" : "stamps"} until your treat.`;
  rewardStatus.classList.toggle("is-ready", isReady);

  const waitMs = state.lastStampAt + COOLDOWN_MS - Date.now();
  addStampButton.disabled = isReady || waitMs > 0;
  if (isReady) {
    addStampButton.innerHTML = "Treat ready <span aria-hidden=\"true\">✦</span>";
  } else if (waitMs > 0) {
    addStampButton.innerHTML = `Next demo stamp in ${formatRemaining(waitMs)}`;
  } else {
    addStampButton.innerHTML = "Add a demo stamp <span aria-hidden=\"true\">✳</span>";
  }
}

function formatRemaining(milliseconds) {
  const totalMinutes = Math.ceil(milliseconds / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
}

function openCard() {
  render();
  dialog.showModal();
}

for (const button of ["#get-card-button", "#header-card-button", "#closing-card-button"]) {
  document.querySelector(button).addEventListener("click", openCard);
}

document.querySelector("#dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

addStampButton.addEventListener("click", () => {
  const state = readDemoState();
  if (state.count >= STAMP_TARGET) return;
  const waitMs = state.lastStampAt + COOLDOWN_MS - Date.now();
  if (waitMs > 0) {
    showToast(`Your next demo stamp is available in ${formatRemaining(waitMs)}.`);
    return;
  }
  const updated = { count: state.count + 1, lastStampAt: Date.now() };
  if (writeDemoState(updated)) {
    render();
    showToast(updated.count === STAMP_TARGET ? "That's ten! Your demo treat is ready." : "A demo stamp added. See you next visit!");
  }
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) render();
});
render();

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.error("The Aaya Resin Art service worker could not be registered.", error);
    });
  });
}
