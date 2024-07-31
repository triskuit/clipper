const form = document.getElementById("notion-form");
const notifier = document.getElementById("notifier");

const tokenField = document.getElementById("token");
const databaseIdField = document.getElementById("databaseID");

function notify(msg) {
  notifier.innerText = msg;
  resetNotifier();
}

function resetNotifier(timeout = 1000) {
  setTimeout(() => (notifier.innerText = ""), timeout);
}

function saveOptions(e) {
  e.preventDefault();

  const token = tokenField.value;
  const databaseID = databaseIdField.value;

  chrome.storage.sync.set({ token, databaseID }, notify("Saved!"));
}

async function getOptions() {
  const { token, databaseID } = await chrome.storage.sync.get();

  tokenField.value = token;
  databaseIdField.value = databaseID;
}

document.addEventListener("DOMContentLoaded", getOptions);
form.addEventListener("submit", async (e) => saveOptions(e));
