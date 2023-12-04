const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://chukwuogorchinwe:${password}@mycluster.atohwyn.mongodb.net/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: "Chinwe Nwankwo",
  number: "081-23596-09",
});

person.save().then((result) => {
  console.log("person saved!");
  mongoose.connection.close();
});
