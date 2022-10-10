// Create express app
var express = require("express")
var app = express()

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let cors = require("cors");
app.use(cors());

//routes
const userRoute = require("./src/routes/User")
const clientRoute = require("./src/routes/Client")
const typeRoute = require("./src/routes/Type")
const itemRoute = require("./src/routes/Item")

app.use('/api/user', userRoute);
app.use('/api/client', clientRoute);
app.use('/api/type', typeRoute);
app.use('/api/item', itemRoute)


// Server port
var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});

// Root endpoint
app.get("/", (req, res, next) => {
    res.json({"message":"Ok"})
});

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

