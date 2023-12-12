/* eslint-disable no-trailing-spaces */
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    console.log("failed request");
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());
app.use(requestLogger);
morgan.token("type", (request, response) => {
  return JSON.stringify({
    name: request.body.name,
    number: request.body.number,
  });
});

//app.use(
//  morgan(":method :url :status :res[content-length] :response-time ms - :type")
//); // note: this is used if we want to use morgan on each route

//app.get("/", morgan("tiny"), (request, response) => {
// response.send(
//   "<h1>Welcome to MySportskit Shop Once again, Home for all your sporting needs!</h1><p>Over 50% discount on selected items</p>"
//  );
//});

app.get("/api/persons", morgan("tiny"), (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/info", morgan("tiny"), (request, response) => {
  const currentTime = new Date().toString();
  Person.find({}).then((person) => {
    response.send(
      `<p>Phonebook has info for ${person.length} people</p> <p>${currentTime}</p>`
    );
  });
});

app.get("/api/persons/:id", morgan("tiny"), (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", morgan("tiny"), (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});
//const newID = () => {
//  const maxID =
//    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
//  return maxID + 1;
//};

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  });
  newPerson
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.use(unknownEndpoint);
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

console.log("hello");
console.log("welome");
console.log("what can we do for you today?");
