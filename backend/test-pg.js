const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:admin@localhost:5432/SancochoLab?schema=public'
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to SancochoLab database");
    
    // Inspect OllaPedidoItem
    const res = await client.query('SELECT snapshot FROM "OllaPedidoItem" ORDER BY "idOllaPedidoItem" DESC LIMIT 1;');
    if (res.rows.length > 0) {
      console.log("Latest OllaPedidoItem Snapshot:");
      console.log(JSON.stringify(res.rows[0].snapshot, null, 2));
    } else {
      console.log("No OllaPedidoItem found.");
    }

  } catch (err) {
    console.error("Database Error:", err.message);
  } finally {
    await client.end();
  }
}

run();
