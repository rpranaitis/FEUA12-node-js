const express = require("express");
const casual = require("casual");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());

const randomCity = casual.city;
const randomNumber = Math.floor(Math.random() * 10) + 1;
const personCredentials = `${casual.name_suffix} ${casual.first_name} ${casual.last_name}`;

app.get("/", (req, res) => {
    res.send(
        "Random city: " +
            randomCity +
            "<br>" +
            "Random number: " +
            randomNumber +
            "<br>" +
            "Person: " +
            personCredentials
    );
});

app.listen(port, () => {
    console.log("App is listening on the port", port);
});
