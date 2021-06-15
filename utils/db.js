const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27107/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const contact1 = new Contact({
  name: "Rezky",
  nohp: "081234567",
  email: "rezkyrizaldi30@gmail.com",
});

contact1.save().then((result) => console.log(result));
