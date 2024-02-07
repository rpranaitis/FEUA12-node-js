const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 8080;
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o98qsjc.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(URI);

app.get('/users', async (req, res) => {
  try {
    const connection = await client.connect();
    const data = await connection.db(process.env.DB_DATABASE).collection('users').find().toArray();
    await connection.close();

    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).send({ message: 'Bad request structure. Required fields: name, email' });
  }

  try {
    const connection = await client.connect();
    await connection.db(process.env.DB_DATABASE).collection('users').insertOne(req.body);
    await connection.close();

    return res.send({ message: 'User successfully created.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.get('/comments', async (req, res) => {
  try {
    const connection = await client.connect();
    const data = await connection
      .db(process.env.DB_DATABASE)
      .collection('comments')
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: {
            path: '$user',
          },
        },
      ])
      .toArray();
    await connection.close();

    const response = data.map(item => {
      return {
        _id: item._id,
        date: item.date,
        comment: item.comment,
        name: item.user.name,
      };
    });

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post('/comments', async (req, res) => {
  const { user_id, date, comment } = req.body;

  if (!user_id || !date || !comment) {
    return res.status(400).send({ message: 'Bad request structure. Required fields: user_id, date, comment' });
  }

  if (!ObjectId.isValid(user_id)) {
    return res.status(400).send({ message: 'Invalid user_id format. Must be a 24 character hex string.' });
  }

  const body = { ...req.body, user_id: new ObjectId(`${req.body.user_id}`) };

  try {
    const connection = await client.connect();
    await connection.db(process.env.DB_DATABASE).collection('comments').insertOne(body);
    await connection.close();

    return res.send({ message: 'Comment successfully added.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.delete('/comments/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid comment id format. Must be a 24 character hex string.' });
  }

  try {
    const connection = await client.connect();
    const response = await connection
      .db(process.env.DB_DATABASE)
      .collection('comments')
      .deleteOne({ _id: new ObjectId(id) });
    await connection.close();

    if (response.deletedCount === 0) {
      return res.status(400).send({ message: `Comment with id ${id} not found in database.` });
    }

    return res.send({ message: 'Comment successfully deleted.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
