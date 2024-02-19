const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.BACKEND_PORT || 8080;
const URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o98qsjc.mongodb.net/${process.env.DB_DATABASE}?retryWrites=true&w=majority`;
const client = new MongoClient(URI);

function generateRandomIPAddress() {
  const getRandomByte = () => Math.floor(Math.random() * 256);
  return `${getRandomByte()}.${getRandomByte()}.${getRandomByte()}.${getRandomByte()}`;
}

app.get('/memberships', async (req, res) => {
  try {
    const connection = await client.connect();
    const data = await connection.db(process.env.DB_DATABASE).collection('services').find().toArray();
    await connection.close();

    return res.send(data);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post('/memberships', async (req, res) => {
  const { name, price, description } = req.body;

  if (!name || !price || !description) {
    return res.status(400).send({ message: 'Bad request structure. Required fields: name, price, description' });
  }

  try {
    const connection = await client.connect();
    await connection.db(process.env.DB_DATABASE).collection('services').insertOne(req.body);
    await connection.close();

    return res.send({ message: 'Service successfully created.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.delete('/memberships/:id', async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: 'Invalid service id format. Must be a 24 character hex string.' });
  }

  try {
    const connection = await client.connect();
    const response = await connection
      .db(process.env.DB_DATABASE)
      .collection('services')
      .deleteOne({ _id: new ObjectId(id) });
    await connection.close();

    if (response.deletedCount === 0) {
      return res.status(400).send({ message: `Service with id ${id} not found in database.` });
    }

    return res.send({ message: 'Service successfully deleted.' });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.get('/users/:order?', async (req, res) => {
  const { order } = req.params;
  const orderParam = order && order.toLowerCase() === 'desc' ? -1 : 1;

  try {
    const connection = await client.connect();
    const data = await connection
      .db(process.env.DB_DATABASE)
      .collection('users')
      .aggregate([
        {
          $lookup: {
            from: 'services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service',
          },
        },
        {
          $unwind: {
            path: '$service',
          },
        },
      ])
      .sort({ name: orderParam })
      .toArray();
    await connection.close();

    const response = data.map((item) => ({
      _id: item._id,
      name: item.name,
      surname: item.surname,
      email: item.email,
      ip: item.ip,
      service: item.service,
    }));

    return res.send(response);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.post('/users', async (req, res) => {
  const { name, surname, email, service_id } = req.body;

  if (!name || !surname || !email || !service_id) {
    return res.status(400).send({ message: 'Bad request structure. Required fields: name, surname, email, service_id' });
  }

  if (!ObjectId.isValid(service_id)) {
    return res.status(400).send({ message: 'Invalid service id format. Must be a 24 character hex string.' });
  }

  try {
    const connection = await client.connect();
    const service = await connection
      .db(process.env.DB_DATABASE)
      .collection('services')
      .findOne({ _id: new ObjectId(`${service_id}`) });

    if (!service) {
      await connection.close();

      return res.status(500).send({ message: `Service with id ${service_id} not found.` });
    }

    req.body.service_id = new ObjectId(`${req.body.service_id}`);
    req.body.ip = generateRandomIPAddress();

    await connection.db(process.env.DB_DATABASE).collection('users').insertOne(req.body);
    await connection.close();

    return res.send({ message: `User ${name} ${surname} with ${service.name} membership successfully created.` });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
