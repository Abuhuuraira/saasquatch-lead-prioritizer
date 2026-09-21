// Vercel serverless entry point.
// Vercel turns every file under /api into a function; exporting the Express
// app hands it the (req, res) pair directly, so the same code runs here and
// under `npm start` in backend/.
module.exports = require("../backend/app");
