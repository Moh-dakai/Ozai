export function showToast(message, type = "info", duration = 3000) {
  const containerId = "app-toasts";
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.className = "app-toasts";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  const hide = () => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 260);
  };

  const timeout = setTimeout(hide, duration);
}