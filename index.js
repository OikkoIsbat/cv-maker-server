const express = require('express');
const { MongoClient } = require('mongodb');

const ObjectId = require('mongodb').ObjectId;

require('dotenv').config();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ggtng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('cvMaker');
        const cvCollection = database.collection('cv');


        //POST API
        app.post('/cv', async (req, res) => {
            const newCV = req.body;
            const result = await cvCollection.insertOne(newCV);
            res.json(result);

        })

        //GET CV
        app.get('/cv', async (req, res) => {
            const cursor = cvCollection.find({});
            const cvs = await cursor.toArray();
            res.send(cvs);
        })

        //GET SINGLE CV 
        app.get('/cv/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting', id);
            const query = { _id: ObjectId(id) };
            const result = await cvCollection.findOne(query);
            res.json(result);
        })

    }
    finally {

    }
}



run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running...');
})

app.listen(port, () => {
    console.log('Running on port ', port);
})