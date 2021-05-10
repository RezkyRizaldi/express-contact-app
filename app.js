const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { loadContact, findContact } = require("./utils/contacts");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(expressLayouts); // Third-party middleware
app.use(express.static("public")); // Built-in middleware

app.get("/", (req, res) => {
  // res.send("Hello, World!");

  // res.json({
  //   name: "Rezky",
  //   email: "rezkyrizaldi30@gmail.com",
  //   noHP: "08123456789",
  // });

  // res.sendFile("./index.html", { root: __dirname });

  res.render("index", {
    title: "Express Contact App",
    layout: "layouts/main",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
    layout: "layouts/main",
  });
});

app.get("/contact", (req, res) => {
  const contacts = loadContact();

  res.render("contact", {
    title: "Contact Page",
    layout: "layouts/main",
    contacts,
  });
});

app.get("/contact/:name", (req, res) => {
  const contact = findContact(req.params.name);

  res.render("detail", {
    title: "Detail Page",
    layout: "layouts/main",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>Error: (404) Page Not Found.</h1>");
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/* CLI */
// const yargs = require("yargs");
// const { saveContact, listContact, detailContact, deleteContact } = require("./contacts");

// yargs
//   .command({
//     command: "add",
//     describe: "Add new contact",
//     builder: {
//       name: {
//         describe: "Full name",
//         demandOption: true,
//         type: "string",
//       },
//       email: {
//         describe: "Email Address",
//         demandOption: false,
//         type: "string",
//       },
//       noHP: {
//         describe: "Phone number",
//         demandOption: true,
//         type: "string",
//       },
//     },
//     handler(argv) {
//       saveContact(argv.name, argv.email, argv.noHP);
//     },
//   })
//   .demandCommand();

// yargs.command({
//   command: "list",
//   describe: "Show all contact name and email",
//   handler() {
//     listContact();
//   },
// });

// yargs.command({
//   command: "detail",
//   describe: "Show details of contact by name",
//   builder: {
//     name: {
//       describe: "Full name",
//       demandOption: true,
//       type: "string",
//     },
//   },
//   handler(argv) {
//     detailContact(argv.name);
//   },
// });

// yargs.command({
//   command: "delete",
//   describe: "Delete a contact by name",
//   builder: {
//     name: {
//       describe: "Full name",
//       demandOption: true,
//       type: "string",
//     },
//   },
//   handler(argv) {
//     deleteContact(argv.name);
//   },
// });

// yargs.parse();

// const http = require("http");
// const fs = require("fs");

// const port = 3000;

// const renderHTML = (path, res) => {
//   fs.readFile(path, (err, data) => {
//     if (err) {
//       res.writeHead(404);
//       res.write("Error: (404) Page Not Found.");
//     } else {
//       res.write(data);
//     }
//     res.end();
//   });
// };

// http
//   .createServer((req, res) => {
//     res.writeHead(200, {
//       "Content-Type": "text/html",
//     });

//     const url = req.url;
//     switch (url) {
//       case "/about":
//         renderHTML("./about.html", res);
//         break;
//       case "/contact":
//         renderHTML("./contact.html", res);
//         break;
//       default:
//         renderHTML("./index.html", res);
//         break;
//     }
//   })
//   .listen(port, () => {
//     console.log(`Server is listening on port ${port}..`);
//   });
