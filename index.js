const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 3000

//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ezvyy3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// const uri = mongodb+srv://<username>:<password>@cluster0.ezvyy3c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
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

        const techCollection = client.db("EdTech").collection("tecch");
        const cartCollection = client.db("EdTech").collection("cart");


        app.get('/tech', async(req, res) => {
            const result = await techCollection.find().toArray()
            res.send(result)
        })




        // app.get('/carts', async (req, res) => {
        //     const email = req.query.email
        //     // console.log(email);
        //     const query = { "apartmentItem.email": email }
        //     const result = await cartCollection.find(query).toArray()
        //     res.send(result);
        // })


        app.post('/carts', async (req, res) => {
            const item = req.body
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })
        //
        

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

