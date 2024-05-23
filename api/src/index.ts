import express from  'express';
import 'isomorphic-fetch'
import dotenv from 'dotenv';
import { getXataClient } from './xata';
import fetch from 'isomorphic-fetch';
dotenv.config();


const { PORT } = process.env || 3000;

const app = express();
app.use(express.json({ limit: '50mb'}));

const client = getXataClient(fetch);

app.get('/', async (req, res) => {
    const result = await client.db.sets.getAll();
    return res.json({ results: result });
    // return res.json({ ok: true});
});


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
