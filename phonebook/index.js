const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(express.static('dist'));
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
const port = process.env.port || 3001;

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", morgan("tiny"), (request, response) => {
  response.send(
    "<h1>Welcome to MySportskit Shop Once again, Home for all your sporting needs!</h1><p>Over 50% discount on selected items</p>"
  );
});

app.get("/api/persons", morgan("tiny"), (request, response) => {
  response.json(persons);
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

app.delete("/api/persons/:id", morgan('tiny'), (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

//const newID = () => {
//  const maxID =
//    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
//  return maxID + 1;
//};

app.post(
  "/api/persons",
  morgan(":method :url :status :res[content-length] :response-time ms - :type"),
  (request, response) => {
    const body = request.body;

    if (body.name && body.number) {
      const person = {
        id: Math.floor(Math.random() * 80),
        name: body.name,
        number: body.number,
      };
      if (
        persons.some(
          (person) => person.name === body.name || person.number === body.number
         )
      ) {
        return response
          .status(400)
          .json({ error: "name or number must be unique" });
      }
      persons = persons.concat(person);
      response.json(person);
    } else {
      return response.status(400).json({ error: "content missing" });
    }
  }
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

console.log("hello");
console.log("welcome");
console.log("what can we do for you today?");
