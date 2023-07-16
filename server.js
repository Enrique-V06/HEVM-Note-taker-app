const express = require("express");
const path = require("path");
const {  readFromFile, writeToFile, readAndAppend } = require("./public/assets/js/fsUtils");
const app = express();

const id = require("./public/assets/js/uuid");
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);
app.get("/api/notes", (req, res) => {
  readFromFile("./db/db.json").then((data) => {
    res.json(JSON.parse(data));
    //console.log("This is the data", JSON.parse(data));
  });
  //res.json(notes);
  console.log("method triggered : ", req.method);
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: id(),
    };
    readAndAppend(newNote, "./db/db.json");
    //writeToFile("./db/db.json", notes);
    res.json(newNote);
    //readFromFile("./db/db.json").then((data) => res.json(JSON.parse(data)));
  } else {
    res.error("There was an error");
  }

  //console.log("method triggered : ", req.method);
});

app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  readFromFile("./db/db.json")
    .then((data) => {
      let dbData = JSON.parse(data);
      //console.log("This is the data", dbData);
      const filteredData = dbData.filter((element) => element.id !== noteId);
      //console.log("This is the filtered data", filteredData);
      return filteredData;
    })
    .then((filteredData) => writeToFile("./db/db.json", filteredData));

  res.status(200).json({ message: "User deleted successfully" });
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);