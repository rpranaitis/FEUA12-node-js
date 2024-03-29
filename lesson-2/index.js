const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
    res.send("OK");
});

const brands = ["BMW", "VW", "Porsche", "Audi"];

app.get("/brands", (req, res) => {
    res.send(brands);
});

app.listen(port, () => {
    console.log("App is listening on the port", port);
});
