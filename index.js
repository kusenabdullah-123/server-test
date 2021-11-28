const http = require("http");
const {
  getDataAll,
  postData,
  deleteData,
  setHeader,
} = require("./anggotaController");
http
  .createServer(async (req, res) => {
    const formData = (req) => {
      return new Promise((resolve, reject) => {
        const contentLength = req.headers["content-length"];
        req.on("data", (chunk) => {
          const length = Buffer.from(chunk).length;
          if (length == Number.parseInt(contentLength)) {
            resolve(Buffer.from(chunk).toString());
          }
        });
      });
    };
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET,DELETE",
      "Access-Control-Max-Age": 2592000,
      "Access-Control-Allow-Headers":
        "Access-Control-Allow-Origin,Origin, X-Requested-With, Content-Type, Accept",
    };
    if (req.method == "OPTIONS") {
      res.writeHead(200, headers);
      res.end();
      return;
    }
    if (req.method == "GET") {
      if (req.url == "/anggota") {
        setHeader(res);
        const data = await getDataAll();
        res.end(JSON.stringify({ status: "success", data }));
        return;
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ msg: "404 Not Found" }));
        return;
      }
    } else if (req.method == "POST") {
      if (req.url == "/anggota") {
        req.on("end", async () => {
          const body = await formData(req);
          await postData(body);
          setHeader(res);
          res.end(JSON.stringify({ status: "success Add data" }));
        });
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ msg: "404 Not Found" }));
        return;
      }
    } else if (req.method == "DELETE") {
      let bodyDelete;
      req.on("data", (chunk) => {
        bodyDelete = JSON.parse(chunk.toString());
      });
      req.on("end", async () => {
        const { id } = bodyDelete;
        await deleteData(id);
        setHeader(res);
        res.end(JSON.stringify({ status: "success delete data" }));
      });
    }
  })
  .listen(process.env.PORT || 5000);
