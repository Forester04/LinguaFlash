import express from  'express';
import 'isomorphic-fetch'
import dotenv from 'dotenv';
import { getXataClient } from './xata';
import fetch from 'isomorphic-fetch';
import { cardsCapitals, cardsProgramming, sets } from './seed_database';
import { SetsRecord } from './xata'; // Import the SetsRecord type from the appropriate file
import { Response } from 'express';
dotenv.config();


const { PORT } = process.env || 3000;

const app = express();
app.use(express.json({ limit: '50mb'}));

const client = getXataClient();

//Get all sets
app.get('/sets', async (req, res) => { 
    const setList = await client.db.sets.select(['id', 'title', 'description', 'image', 'cards']).filter({ private: false }).getAll();
    return res.json({ sets: setList });
})

//Get a single set
app.get('/sets/:id', async (req, res) => {
    const { id } = req.params;
    const set = await client.db.sets.read(id);
    return res.json({ set });
})

// Create a new set
app.post('/sets', async (req, res) => {
    const { title, description, private: isPrivate, image, cards } = req.body;
    const set = await client.db.sets.create({ 
        title, 
        description, 
        private: isPrivate, 
        image: image ? { base64Content: image, mediaType: 'image/png', enablePublicUrl: true } : undefined,
        cards });
        return res.json(set);
});

// Add a set to user favorities
app.post('/user_sets', async (req, res) => {
    const { user, set } = req.body;
    const userSet = await client.db.user_sets.create({ user, set });
    return res.json(userSet);
});

// Get all user sets
app.get('/user_sets', async (req, res) => {
    const { user } = req.query;

    const sets = await client.db.user_sets.select(['id', 'set.*']).filter({ user: `$user`}).getAll();

    return res.json( sets );
});

// Remove a set
app.delete('/sets/:id', async (req, res) => {
    const { id } = req.params;
    const existingSets = await client.db.user_sets.filter({ set: id }).getAll();

    if (existingSets.length > 0) {
        const toDelete = existingSets.map((set: SetsRecord) => set.id);
        await client.db.user_sets.delete(toDelete);
    }
    await client.db.sets.delete(id);

    return res.json({ success: true });
});

// Create a new card
app.post('/cards', async (req, res) => {
    const { set, question, answer } = req.body;

    const card = await client.db.cards.create({ 
        set, 
        question, 
        answer
    });

    if (card) {
        await client.db.sets.update(set, { cards: { $increment: 1 }});
    }

    return res.json(card);
}); 

app.get('/cards', async (req, res) => {
    const { setid } = req.query;
    const cards = await client.db.cards.select(['*', 'set.*']).filter({ set: setid }).getAll();
    return res.json(cards);
});

// Learn a specific number of cards from a set
app.get('/cards/learn', async (req, res) => {
    const { setid, limit } = req.query;

    const cards = await client.db.cards.select(['question', 'answer', 'image']).filter({set: setid}).getAll();

    // Get a random SET OF cards using limit
    const randomCards = cards
        .map((value: any) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, +limit!);

        return res.json(randomCards);
});

// Create learning progress
app.post('/learnings', async (req, res) => {
    const { user, set, cardTotal, correct, wrong } = req.body;
    const obj = {
        user,
        set,
        cards_total: +cardTotal,
        cards_wrong: +wrong,
        cards_correct: +correct,
        score: (+correct / +cardTotal) * 100,
    };
    const learning = await client.db.learnings.create(obj);
    return res.json(learning);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
