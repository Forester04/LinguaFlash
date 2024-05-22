import express from  'express';
import dotenv from 'dotenv';
dotenv.config();

const { PORT } = process.env || 3000;

const app = express();

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
