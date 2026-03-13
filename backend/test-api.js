const fetch = require('node-fetch');

async function main() {
  try {
    const res = await fetch('http://localhost:3000/pots/pedidos');
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (e) {
    console.log("Fetch error:", e.message);
  }
}

main();
