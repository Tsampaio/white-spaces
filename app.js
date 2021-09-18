const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');

const app = express();

//init middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: false }));
app.use(cookieParser());
// app.use(fileUpload());
app.use(cors());

dotenv.config({ path: './.env' });
const connectDB = require('./config/db');

//Connect Database
connectDB();

//test middleware
app.use((req, res, next) => {
  console.log('Middleware');
  next();
});

app.use(express.static(path.join(__dirname, '/client/build')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.get('/test', (req, res) => {
  res.send({
    name: 'Telmo',
  });
});

//Define Routes
app.use('/api', require('./routes/pagesRoutes'));
app.use('/api', require('./routes/braintree'));
app.use('/api', require('./routes/membershipRoutes'));
app.use('/api', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/webhook', require('./routes/webhook'));
app.use('/webhook/pastdue', require('./routes/webhook'));
// app.use('/api/uploadCourseImage', require('./routes/uploadRoutes'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './client/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
