const fs = require("fs");
const chalk = require("chalk");
const validator = require("validator");

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContact = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);

  return contacts;
};

const saveContact = (name, email, noHP) => {
  const contact = { name, email, noHP };
  const contacts = loadContact();
  const duplicate = contacts.find((contact) => contact.email.toLowerCase() === email.toLowerCase());

  if (duplicate) {
    console.log(chalk.red.bold("Email address has already taken. Please use another email!"));
    return false;
  }

  if (email) {
    if (!validator.isEmail(email)) {
      console.log(chalk.red.bold("Invalid email format. Please input a valid email!"));
      return false;
    }
  }

  if (!validator.isMobilePhone(noHP, "id-ID")) {
    console.log(chalk.red.bold("Invalid phone number format. Please input a valid phone number!"));
    return false;
  }

  contacts.push(contact);
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2));
  console.log(chalk.green.bold("Thank you for inputting the data!"));
};

const listContact = () => {
  const contacts = loadContact();

  console.log(chalk.cyan.bold("Contact Lists"));
  contacts.forEach((contact, i) => {
    console.log(chalk.green.bold`${i + 1}. ${contact.name} - ${contact.email}`);
  });
};

const detailContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());

  if (!contact) {
    console.log(chalk.red.bold`Contact with name ${name} not found.`);
    return false;
  }

  console.log(chalk.cyan.bold(contact.name));
  console.log(chalk.green.bold`Phone Number: ${contact.noHP}`);
  if (contact.email) {
    console.log(chalk.green.bold`Email Address: ${contact.email}`);
  }
};

const deleteContact = (name) => {
  const contacts = loadContact();
  const newContact = contacts.filter((contact) => contact.name.toLowerCase() !== name.toLowerCase());

  if (contacts.length === newContact.length) {
    console.log(chalk.red.bold`Contact with name ${name} not found.`);
    return false;
  }

  fs.writeFileSync("data/contacts.json", JSON.stringify(newContact, null, 2));
  console.log(chalk.green.bold`Data Contact ${name} successfully deleted!`);
};

module.exports = { saveContact, listContact, detailContact, deleteContact };
