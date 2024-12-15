import express from 'express';
import dontev from 'dotenv';
dontev.config();


const app = express();



app.listen(3001, () => {
    console.log('Server is running..');
});


app.get('/', (req,res) => {
    res.send('You are at the frontpage of this server');
});
