/**
 * utils.js — funções utilitárias reutilizáveis
 */

/** Debounce: evita chamadas repetidas (ex: em input de busca) */
export function debounce(fn, wait = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/** Simple fetch wrapper com tratamento básico de erros e timeout */
export async function fetchJson(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} — ${text}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) return res.json();
    return res.text();
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

/** Formata CPF/CNPJ/Telefone simples (exemplos rápidos) */
export function formatTelefone(v) {
  if (!v) return "";
  const digits = v.replace(/\D/g, "");
  if (digits.length <= 10) {
    // (XX) XXXX-XXXX
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, (_m, a, b, c) => {
      return c ? `(${a}) ${b}-${c}` : (b ? `(${a}) ${b}` : `(${a})`);
    });
  } else {
    // (XX) 9XXXX-XXXX
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
}

/** Mostra um toast simples (DOM) */
export function toast(message, { duration = 3000 } = {}) {
  let wrapper = document.getElementById("__toast_wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "__toast_wrapper";
    wrapper.style.position = "fixed";
    wrapper.style.right = "16px";
    wrapper.style.bottom = "16px";
    wrapper.style.zIndex = 9999;
    document.body.appendChild(wrapper);
  }

  const t = document.createElement("div");
  t.textContent = message;
  t.style.background = "rgba(0,0,0,0.85)";
  t.style.color = "#fff";
  t.style.padding = "10px 14px";
  t.style.borderRadius = "6px";
  t.style.marginTop = "8px";
  t.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  wrapper.appendChild(t);

  setTimeout(() => {
    t.style.transition = "opacity .35s, transform .35s";
    t.style.opacity = "0";
    t.style.transform = "translateY(8px)";
    setTimeout(() => t.remove(), 400);
  }, duration);
}

/** Máscara simples para inputs de telefone (adiciona evento) */
export function applyTelefoneMask(input) {
  if (!input) return;
  input.addEventListener("input", (e) => {
    const pos = input.selectionStart;
    const before = input.value;
    input.value = formatTelefone(input.value);
    // tenta manter o cursor próximo da posição anterior
    const diff = input.value.length - before.length;
    input.setSelectionRange(pos + diff, pos + diff);
  });
}