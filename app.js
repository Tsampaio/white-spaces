const express = require('express');
const dotenv = require('dotenv');

const app = express();

dotenv.config({ path: './.env' });
const connectDB = require('./config/db');

console.log(process.env)

//Connect Database
connectDB();

//init middleware
app.use(express.urlencoded());
app.use(express.json({ extended: false }));

//test middleware
app.use((req, res, next) => {
    console.log("Middleware");
    next();
});

app.get('/', (req, res) => {
    res.send({
        name: 'Telmo'     
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));