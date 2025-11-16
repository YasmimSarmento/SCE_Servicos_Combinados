const API_URL = "https://sua-api.com";

async function apiGet(endpoint) {
  const res = await fetch(API_URL + endpoint);
  return res.json();
}

async function apiPost(endpoint, data) {
  const res = await fetch(API_URL + endpoint, {
    method: "POST",
    body: data
  });
  return res.json();
}