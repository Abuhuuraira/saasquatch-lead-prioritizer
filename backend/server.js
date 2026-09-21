// server.js — local development entry point.
// The API itself lives in app.js so the same app can also be served as a
// serverless function (see api/index.js).
const app = require("./app");

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`LeadRank API running on http://localhost:${PORT}`));
