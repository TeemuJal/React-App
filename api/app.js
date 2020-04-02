var express = require("express");
var cors = require("cors");
var cookieParser = require('cookie-parser');

var app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (req, res, next) => {
    res.send("Hello world!");
});

app.listen(9000, () => {
    console.log("Server running on port 9000");
});