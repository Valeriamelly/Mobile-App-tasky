const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const cors = require('cors');
const tareaCron = require('./utils/cronJob')

const app = express();
const port = 8000;

//Usamos express en vez de bodyparse porque en las últimas
//express lo implemente por defecto al importar su libreria
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
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

const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/users', userRoutes);

tareaCron.start();

app.listen(port, () => {
    console.log("Server is running on port 8000");
});

