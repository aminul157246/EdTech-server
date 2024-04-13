const express = require('express')
const cors = require('cors')
const app = express()


const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const stripe = require('stripe')(process.env.SECRET_PAYMENT_KEY)
const port = process.env.PORT || 3000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvzk3hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = mongodb+srv://<username>:<password>@cluster0.ezvyy3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://EdTech:<password>@cluster0.qvzk3hq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const techCollection = client.db("EdTechDB").collection("tech");
        const cartCollection = client.db("EdTechDB").collection("cart");
        const paymentCollection = client.db("EdTechDB").collection("payments");

        app.get('/tech', async (req, res) => {
            const result = await techCollection.find().toArray()
            res.send(result)
        })




        app.get('/carts', async (req, res) => {
            const email = req.query.email
            // console.log(email);
            const query = { "cartItem.email": email }
            const result = await cartCollection.find(query).toArray()
            res.send(result);
        })


        app.post('/carts', async (req, res) => {
            const item = req.body
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })
        //





// payment intent
app.post('/create-payment-intent', async (req, res) => {
    const { price } = req.body;
    const amount = parseInt(price * 100);
    console.log(amount, 'amount inside the intent')

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method_types: ['card']
    });

    res.send({
      clientSecret: paymentIntent.client_secret
    })
  });


  app.get('/payments/:email', async (req, res) => {
    const query = { email: req.params.email }
    
    const result = await paymentCollection.find(query).toArray();
    res.send(result);
  })

  app.post('/payments', async (req, res) => {
    const payment = req.body;
    const paymentResult = await paymentCollection.insertOne(payment);

    //  carefully delete each item from the cart
    console.log('payment info', payment);
    

    res.send({ paymentResult });
  })







        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {


    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('CRUD  is running ......!')
})

app.listen(port, () => {
    console.log(`App is  listening on port ${port}`)
})

