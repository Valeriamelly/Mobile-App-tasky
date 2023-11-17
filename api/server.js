const express = require('express');
const app = express();
const mongoose = require("mongoose");



const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const port = 8000;


app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors());

mongoose.connect("mongodb+srv://sperezc5:1234@tasky-app.jxoewoy.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log("Error connecting to MongoDb", err);
});

app.set('port', port)

userRoutes(app);
projectRoutes(app);

app.listen(port, () => {
    console.log("Server is running on port 8000");
});
