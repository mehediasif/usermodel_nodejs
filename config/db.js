const mongoose = require('mongoose');

const connectWithDB = () => {

    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(console.log(`Db was Connected`))
        .catch(error => {
            console.log(`DB connection ISSUES`);
            console.log(error);
            process.exit(1);
        });
}

module.exports = connectWithDB;