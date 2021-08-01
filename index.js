const fs = require("fs"); // helps us access the file system
const http = require("http"); // Helps us with netwoking capability
const url = require("url");
const replaceTemplate = require("./modules/replaceTemp");
// import replaceTemplate from './modules/replaceTemp';
const slugify = require("slugify"); //Slug is the last part of a url that contains a unique string that identifies what is showing.

//////////////////////////////////////////////
//File system

// Blocking Sychronous way
const hello = "Hello world";
// console.log(hello);

const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

const textOut = `This is what we know about the avacado: ${textIn}.\nCreated on ${new Date().toISOString()}`;

fs.writeFileSync("./txt/output.txt", textOut);
// console.log('file written');

// Non-blocking, asynchronous way
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("ERROR!!!");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
      fs.writeFile("./txt/final.txt", `${data2}\n ${data3}`, "utf-8", (err) => {
        if (err) throw err;
        // console.log('file has been written')
      });
    });
  });
});

// console.log('Reading file...');
//Check for readFile() method.

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productData = JSON.parse(data);
const productOverview = fs.readFileSync(`${__dirname}/templates/templatOverview.html`, "utf-8");
const productCard = fs.readFileSync(`${__dirname}/templates/templateCard.html`, "utf-8");
const productTemp = fs.readFileSync(`${__dirname}/templates/template_product.html`, "utf-8");

const slugs = productData.map((product) => slugify(product.productName, { lower: true }));
// console.log(slugs);
/////////////////////////////////////////////////////
//SERVER
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  // const pathName = req.url;
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/overview" || pathname === "/") {
    //Overview page
    res.writeHead(200, { "Content-type": "text/html" });

    const cardHtml = productData.map((el) => replaceTemplate(productCard, el)).join("");

    const output = productOverview.replace("{%PRODUCT_CARDS%}", cardHtml);
    res.end(output);
  } else if (pathname === "/api") {
    //Api page
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);
  } else if (pathname === "/product") {
    //Product page
    res.writeHead(200, { "Content-type": "text/html" });
    const product = productData[query.id];
    const output = replaceTemplate(productTemp, product);

    res.end(output);
    //Notfound page
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "Hello world",
    });
    res.end("<h1>Page does not Exist</h1>");
  }
});
// console.log(__dirname);
server.listen(8090, "127.0.0.1", () => {
  console.log("Listening to request on port 8090");
});
