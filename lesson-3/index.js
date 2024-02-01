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

app.get('/people', async (req, res) => {
  try {
    const connection = await client.connect();
    const data = await connection.db(process.env.DB_DATABASE).collection('people').find().toArray();
    await connection.close();

    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post('/people/add', async (req, res) => {
  const { name, surname, age } = req.body;

  if (!name || !surname || !age) {
    return res.status(400).send({ message: 'Bad request structure. Required fields: name, surname, age' });
  }

  try {
    const connection = await client.connect();
    await connection.db(process.env.DB_DATABASE).collection('people').insertOne(req.body);
    await connection.close();

    return res.send({ message: 'New person successfully added.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
