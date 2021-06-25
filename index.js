// Main (required)
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()

// dotENV (required)
const port = process.env.PORT || 5555;
const name = process.env.DB_NAME;
const pass = process.env.DB_PASS;
const dbName = process.env.DB_MAIN;
const mcCollection = process.env.DB_MACO;
const reCollection = process.env.DB_RECO;
const odCollection = process.env.DB_ODCO;
const adCollection = process.env.DB_ADCO;
const uri = `mongodb+srv://${name}:${pass}@cluster0.lq9rh.mongodb.net/${dbName}?retryWrites=true&w=majority`;

app.use(cors())
app.use(bodyParser.json())

// Set connection with database
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('Connection error:', err);
  // Product Collections
  const servicesCollection = client.db(dbName).collection(mcCollection);
  console.log('Database Connected Successfully!');
  
  // Add Service API
  app.post('/addService', (req, res) => {
    const newService = req.body;
    console.log('adding new Service', newService);
    servicesCollection.insertOne(newService)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  // All Services List API
  app.get('/services', (req, res) => {
    servicesCollection.find()
    .toArray((err, documents) => {
      res.send(documents)
    })
  })

  // Delete a Service API
  app.delete('/serviceDelete/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    servicesCollection.deleteOne({_id: id})
    .then(result => {
      console.log(result);
    })
  })

  // Review Collections
  const reviewsCollection = client.db(dbName).collection(reCollection);
  // console.log(reviewsCollection);


  // Review Collections Setup
  app.post('/addReview', (req, res) => {
    const newReview = req.body;
    console.log(newReview);
    reviewsCollection.insertOne(newReview)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/reviews', (req, res) => {
    // console.log(req.query.email);
    reviewsCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })


  // Orders Collections
  const ordersCollection = client.db(dbName).collection(odCollection);
  // console.log(ordersCollection);


  // Orders Collections Setup
  app.post('/addOrders', (req, res) => {
    const newOrders = req.body;
    console.log(newOrders);
    ordersCollection.insertOne(newOrders)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  

  // Orders by email
  app.get('/orders', (req, res) => {
    console.log(req.query.email);
    ordersCollection.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // Orders by no email
  app.get('/orderByAdmin', (req, res) => {
    // console.log(req.query.email);
    ordersCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // Load Single Order
  app.get('/order/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    ordersCollection.find({_id: id})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })

  // Data Update API
  app.patch('/updateOrder/:id', (req, res) => {
    const id = ObjectID(req.params.id);
    ordersCollection.updateOne(
      {_id: id},
      {
        $set: {status: req.body.status}
      }
    )
    .then(result => {
      console.log('updated');
    })
  })

  // Admin Collections
  const adminsCollection = client.db(dbName).collection(adCollection);
  // console.log(adminsCollection);
  // **********  Admin  ********** //  
  
  // Admin Collections Setup
  app.post('/addAdmin', (req, res) => {
    const newAdmin = req.body;
    console.log(newAdmin);
    adminsCollection.insertOne(newAdmin)
    .then(result => {
      console.log('inserted count:', result.insertedCount);
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/admins', (req, res) => {
    // console.log(req.query.email);
    adminsCollection.find()
    .toArray((err, documents) => {
      res.send(documents);
    })
  })

  // Orders by email
  app.get('/isAdmin', (req, res) => {
    console.log(req.query.email);
    adminsCollection.find({adminEmail: req.query.email})
    .toArray((err, documents) => {
      res.send(documents[0]);
    })
  })
  // **********  Admin  ********** //
  

  // Root Path
  app.get('/', (req, res) => {
    res.send("Hello, Viewers! This URL from Heroku is available now!")
  })

  // client.close();
});



app.listen(port)