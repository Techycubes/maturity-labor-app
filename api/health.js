import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { version } = require("../package.json");

export default function handler(req, res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.status(200).json({ status: "ok", version });
}
