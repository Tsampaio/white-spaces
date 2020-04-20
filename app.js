const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

//init middleware
app.use(express.urlencoded());
app.use(express.json({ extended: false }));
app.use(cors());
app.use(cookieParser());

dotenv.config({ path: './.env' });
const connectDB = require('./config/db');

//Connect Database
connectDB();

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

//Define Routes
app.use('/api', require('./routes/pagesRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));