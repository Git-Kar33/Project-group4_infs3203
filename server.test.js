const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const business = require('./business.js');

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.get("/", async (req, res) => {
    res.send("Welcome to the Waste Management System");
});

app.post('/login-form', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const isValidLogin = await business.checkLogin(username, password);
    if (isValidLogin) {
        res.send("Login successful");
    } else {
        res.send("Invalid credentials");
    }
});

app.get("/info", async (req, res) => {
    const qid = req.query.qid;
    const customerInfo = await business.getCustomerDetails(qid);
    res.json(customerInfo);
});

module.exports = app;
