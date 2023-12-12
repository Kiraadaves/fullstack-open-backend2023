const mongoose = require("mongoose");

//if (process.argv.length < 3) {
//console.log("give password as argument");
// process.exit(1);
//}

//const password = process.argv[2];
//const newName = process.argv[3];
//const newNumber = process.argv[4];

mongoose.set("strictQuery", false);
const url = process.env.MONGODB_URI;
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to mongodb");
  })
  .catch((error) => {
    console.log(`error connecting to mongodb: ${error.message}`);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    validate: {
      validator: function (v) {
        const numberPatterns = [/\d{2}-\d{7}/, /\d{3}-\d{8}/];

        return numberPatterns.some((pattern) => pattern.test(v));
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
    required: [true, "User phone number required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);

//const person = new Person({
// name: newName,
//  number: newNumber,
//});

//if (process.argv.length === 3) {
//Person.find({}).then((result) => {
//  console.log("phonebook: ");
//  result.forEach((note) => {
//   console.log(`${note.name} ${note.number}`);
// });
// mongoose.connection.close();
// });
//} else if (process.argv.length > 3) {
//  person
//    .save()
//    .then((result) => {
//      console.log(`added ${newName} number ${newNumber} to phonebook`);
//      mongoose.connection.close();
//   })
//    .catch((error) => {
//      console.error("Error saving person:", error);
//    });
//}
