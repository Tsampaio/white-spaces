const mongoose = require('mongoose');
const db = process.env.DATABASE;

// console.log(db);

console.log(".....")
const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("MongoDB connected");
    } catch(error) {
        console.error(error.message);
        //Exit process with failure
        process.exit(1);
    }
}

module.exports = connectDB;