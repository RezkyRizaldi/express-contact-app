require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { loadContacts, findContact, addContact, checkDuplicate, deleteContact, updateContacts } = require("./utils/contacts");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");

const app = express();
const port = process.env.PORT || 3000;

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

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

app.get("/contact", async (req, res) => {
  // const contacts = loadContacts();
  const contacts = await Contact.find();

  res.render("contact", {
    title: "Contact Page",
    layout: "layouts/main",
    contacts,
    msg: req.flash("msg"),
  });
});

app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Add Contact Form",
    layout: "layouts/main",
  });
});

app.post(
  "/contact",
  [
    body("name").custom(async (value) => {
      // const duplicate = checkDuplicate(value);
      const duplicate = await Contact.findOne({ name: value });

      if (duplicate) {
        throw new Error("Name has already taken. Please use another name!");
      }

      return true;
    }),
    check("email", "Invalid email format. Please input a valid email!").isEmail(),
    check("nohp", "Invalid phone number format. Please input a valid phone number!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("add-contact", {
        title: "Add Contact Form",
        layout: "layouts/main",
        errors: errors.array(),
      });
    } else {
      // addContact(req.body);
      Contact.insertMany(req.body, (error, result) => {
        req.flash("msg", "Data contact successfully added!");
        res.redirect("/contact");
      });
    }
  }
);

app.delete("/contact", (req, res) => {
  Contact.deleteOne({ _id: req.body._id }).then((result) => {
    req.flash("msg", "Data contact successfully deleted!");
    res.redirect("/contact");
  });
});

app.get("/contact/edit/:name", async (req, res) => {
  // const contact = findContact(req.params.name);
  const contact = await Contact.findOne({ name: req.params.name });

  res.render("edit-contact", {
    title: "Edit Contact Form",
    layout: "layouts/main",
    contact,
  });
});

app.put(
  "/contact",
  [
    body("name").custom(async (value, { req }) => {
      // const duplicate = checkDuplicate(value);
      const duplicate = await Contact.findOne({ name: value });

      if (value !== req.body.oldName && duplicate) {
        throw new Error("Name has already taken. Please use another name!");
      }

      return true;
    }),
    check("email", "Invalid email format. Please input a valid email!").isEmail(),
    check("nohp", "Invalid phone number format. Please input a valid phone number!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Edit Contact Form",
        layout: "layouts/main",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      // updateContacts(req.body);
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            nohp: req.body.nohp,
          },
        }
      ).then((result) => {
        req.flash("msg", "Data contact successfully updated!");
        res.redirect("/contact");
      });
    }
  }
);

app.get("/contact/:name", async (req, res) => {
  // const contact = findContact(req.params.name);
  const contact = await Contact.findOne({ name: req.params.name });

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
