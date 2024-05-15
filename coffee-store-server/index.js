const express = require('express');
const cors = require('cors');

require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g9b7gzn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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
        await client.connect();
        //fetching data from database
        const coffeeCollection = client.db('coffeeDB').collection('coffee');
        const userCollection = client.db('coffeeDB').collection('user');

        //get data from db to show in localhost/coffee
        app.get('/coffee', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        //find the data to be updated and send it seperately, then updating data using put
        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffee', async (req, res) => {
            //getting data from client i.e front-end
            const newCoffee = req.body;
            console.log(newCoffee);
            //insert into db
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result);
        })

        //update coffee data after fetching data using id
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const updateCoffee = req.body; //brings the data from client 
            const coffee = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo
                },
            };

            const result = await coffeeCollection.updateOne(filter, coffee, options);
            res.send(result);
        })

        //delete data from db after taking params/requests from client
        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(query);
            res.send(result);
        })

        //user related apis
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.post('/users', async (req, res) => {
            //getting data from client i.e front-end
            const newUser = req.body;
            console.log(newUser);
            //insert into db
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })
        app.patch('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email }
            const updateDoc = {
                $set: {
                    lastLoggedAt: user.lastLoggedAt
                },
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.deleteOne(query);
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


//to check if server is running
app.get('/', (req, res) => {
    res.send('Coffee store server is running')
})

app.listen(port, () => {
    console.log(`Coffee server is running on port: ${port}`)
})