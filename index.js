const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors')

require('dotenv').config()


const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello World 123!')
})



const uri = `mongodb+srv://banglaBazar:${process.env.DB_PASS}@cluster0.em86h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("banglaBazar").collection("product");

  app.get("/product", (req, res) => {
    productCollection.find()
    .toArray((err, product) => {
      res.send(product)
      console.log('from database', product)
    })
  })

  app.post('/addProducts', (req, res) => {
    const newProduct = req.body;
    console.log('adding new Product:', newProduct)

    productCollection.insertOne(newProduct)
      .then(result => {
        console.log('Products', result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/deleteProduct/:id', (req, res) => {

    // productCollection.findOneAndDelete({_id: ObjectID(req.params.id)})
    // .then( result => {
    //   console.log(result)
    // })

    const id = ObjectID(req.params.id);
    productCollection.findOneAndDelete({_id:id})
    .then(document => res.send(!!document.value))
  })

  // client.close();
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})