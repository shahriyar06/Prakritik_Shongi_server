const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



// middleware
app.use(cors(
  {
    origin: [
      "http://localhost:5173",
      "https://prakritik-shongi.web.app",
      "https://prakritik-shongi.firebaseapp.com",
    ],
  }
));
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_USER_PASS}@cluster0.qexkjce.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftcollection = client.db('craftDB').collection('craft');
    const subcategorycollection = client.db('craftDB').collection('subcategory');

    // Data collect form craft database
    app.get('/craftlist', async (req, res) => {
      const cursor = craftcollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Data collect from craft database by id
    app.get('/craftlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftcollection.findOne(query);
      res.send(result);
    })

    // Data create on craft database
    app.post('/craftlist', async (req, res) => {
      const newcraft = req.body;
      const result = await craftcollection.insertOne(newcraft);
      res.send(result);
    })

    // Data updated on craft database
    app.put('/craftlist/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedcraft = req.body;
      const updated = {
        $set: {
          title: updatedcraft.title,
           subcategory: updatedcraft.subcategory,
           imageurl: updatedcraft.imageurl,
           description: updatedcraft.description,
           price: updatedcraft.price,
           rating: updatedcraft.rating,
           customization: updatedcraft.customization,
           stockStatus: updatedcraft.stockStatus,
           processingtime: updatedcraft.processingtime
        }
      } 
      const result = await craftcollection.updateOne(filter, updated);
      res.send(result);
    })


    // Data delete in craft database by id
    app.delete('/craftlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await craftcollection.deleteOne(query);
      res.send(result);
    })

    // Data collect form subcategory database
    app.get('/subcategorylist', async (req, res) => {
      const cursor = subcategorycollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Prakritik Shongi-server is running...')
})

app.listen(port, () => {
  console.log(`Prakritik Shongi-server is running on port : ${port}`)
})