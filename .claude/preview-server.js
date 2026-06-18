// Minimaler statischer Vorschau-Server (Node, ohne Abhängigkeiten).
// Bewusst Node statt python3 http.server, weil die Sandbox python3 blockt.
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = "/Users/jorgheidermann/Desktop/Claude_Wettergrafik_Tool";
const PORT = Number(process.env.PORT) || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

http
  .createServer((req, res) => {
    let rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel === "/") rel = "/wettergrafik.html";
    const file = path.join(ROOT, path.normalize(rel));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(PORT, () => console.log("Preview-Server läuft auf http://localhost:" + PORT));
