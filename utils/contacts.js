const fs = require("fs");

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
}

const loadContacts = () => {
  const fileBuffer = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(fileBuffer);

  return contacts;
};

const findContact = (name) => {
  const contacts = loadContacts();
  const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase());

  return contact;
};

const saveContacts = (contacts) => {
  fs.writeFileSync("data/contact.json", JSON.stringify(contacts, null, 2));
};

const addContact = (contact) => {
  const contacts = loadContacts();

  contacts.push(contact);
  saveContacts(contacts);
};

const checkDuplicate = (name) => {
  const contacts = loadContacts();
  return contacts.find((contact) => contact.name === name);
};

module.exports = { loadContacts, findContact, addContact, checkDuplicate };
