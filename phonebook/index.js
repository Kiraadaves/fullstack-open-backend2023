const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");


app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
morgan.token("type", (request, response) => {
  return JSON.stringify({
    name: request.body.name,
    number: request.body.number,
  });
});

//app.use(
//  morgan(":method :url :status :res[content-length] :response-time ms - :type")
//); // note: this is used if we want to use morgan on each route

app.get("/", morgan("tiny"), (request, response) => {
  response.send(
    "<h1>Welcome to MySportskit Shop Once again, Home for all your sporting needs!</h1><p>Over 50% discount on selected items</p>"
  );
});

app.get("/api/persons", morgan("tiny"), (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/info", morgan("tiny"), (request, response) => {
  const currentTime = new Date().toString();
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p> <p>${currentTime}</p>`
  );
});

app.get("/api/persons/:id", morgan("tiny"), (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", morgan("tiny"), (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

//const newID = () => {
//  const maxID =
//    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
//  return maxID + 1;
//};

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(`post body; ${body}`)
  if (body.name === undefined && body.number === undefined) {
    return response.status(400).json({error: 'content missing'})
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })
  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

console.log("hello");
console.log("welome");
console.log("what can we do for you today?");
