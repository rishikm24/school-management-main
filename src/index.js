const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express()

const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname) + '/../.env' })

app.use(bodyParser.json({ limit: "5mb" }))
app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
app.use(cookieParser())

global.MongoDao = require('./common/mongo/mongoose');
MongoDao.connectDB(process.env.MONGO_URL)

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
