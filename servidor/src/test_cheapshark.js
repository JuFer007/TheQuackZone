const app = require('./index.js');
const server = app.listen(4000, async () => {
  console.log('Server started');
  try {
    const res = await fetch('http://localhost:4000/api/cheapshark/deals?title=cyberpunk+2077&limit=3');
    const data = await res.json();
    console.log('CheapShark OK:', JSON.stringify(data).substring(0, 800));
  } catch(e) {
    console.error('Fetch error:', e.message);
  }
  server.close();
  process.exit(0);
});
