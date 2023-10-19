const express = require("express");
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5003;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  //   "mongodb+srv://<username>:<password>@cluster0.nmv0r0r.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp";
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nmv0r0r.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productCollection = client
      .db("brandShopDB")
      .collection("productCollection");

    app.get("/products", async (req, res) => {
      const cursor = productCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/brands/:brand", async (req, res) => {
      const brandName = req.params.brand;
      const cursor = productCollection.find({ brandName: brandName });
      const products = await cursor.toArray();
      res.send(products);
    });

    app.post("/products", async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);

      const result = await productCollection.insertOne(newProduct);
      console.log(
        `A product is added with the _id:${result.insertedId}`,
        result
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ElecTech Brand Store server is running");
});

app.listen(port, () => {
  console.log(`Brand Store server listening on ${port}`);
});
