const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o98qsjc.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(URI);

app.get('/', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
