const express = require('express'); 
const bodyParser = require('body-parser'); 
const cookieParser = require('cookie-parser'); 
const business = require('./business.js');

let app = express();

const handlebars = require('express-handlebars');
app.set('views', __dirname + "/templates"); 
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine());


app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded()); 
app.use(cookieParser()); 
app.use("/static", express.static(__dirname + "/static")); 

// Custom 404 handler
function function404(req, res) {
    res.status(404).render("error404", { layout: undefined }); 
}

//Route for homepage
app.get("/", async (req, res) => {
    res.render('homepage', { layout: "main" });
});

//Route for login page
app.get("/login", async (req, res) => {
    let message = req.query.message; 
    res.render('login', { layout: "main", message: message });
});

// Route for logging out
app.get("/logout", async (req, res) => {
    let key = req.cookies.projectkey; 
    await business.deleteSession(key); 
    res.cookie('projectkey', ''); 
    res.redirect('/login'); 
});

// Route for submitting login form
app.post('/login-form', async (req, res) => {
    let username = req.body.username; 
    let password = req.body.password; 
    if (await business.checkLogin(username, password)) {
        let sessionData = await business.startSession({ username: username }); 
        res.cookie('projectkey', sessionData.sessionKey, { expires: sessionData.expiry }); 
        res.redirect("/search-record"); 
        return;
    }
    res.redirect("/login?message=Invalid Credentials"); 
});

// Route for searching records
app.get("/search-record", async (req, res) => {
    let sessionId = req.cookies.projectkey; 
    let sessionData = await business.getSessionData(sessionId); 
    if (!sessionData) { 
        let sessionData = await business.startSession({ username: "" });
        res.cookie('projectkey', sessionData.sessionKey, sessionData.expiry);
        res.redirect("/login?message=Please Login"); 
        return;
    }
    let message = req.query.message; 
    res.render('searchRecord', { layout: "main", message: message }); 
});

// Route for displaying customer information
app.get("/info", async (req, res) => {
    let sessionId = req.cookies.projectkey; 
    let sessionData = await business.getSessionData(sessionId); 
    if (!sessionData) { 
        let sessionData = await business.startSession({ username: "" }); 
        res.cookie('projectkey', sessionData.sessionKey, sessionData.expiry);
        res.redirect("/login?message=Please Login"); 
        return;
    }
    let qid = req.query.qid;
    if (!(await business.validID(qid))) {
        res.redirect("/search-record?message=Please enter a valid Qatari id");
        return;
    }
    let customerInfo = await business.getCustomerDetails(qid); 
    res.render('customerData', { layout: "main", customerInfo: customerInfo });
});

// Route for adding a record
app.post("/addRecord", async (req, res) => {
    let currentDate = new Date(); 
    let qid = req.body.qid; 
    let wasteType = req.body.wasteType; 
    let category = req.body.category; 
    let weight = Number(req.body.weight); 
    let points = await business.getPoints(category);
    await business.addRecord(currentDate.toLocaleDateString(), qid, wasteType, category, weight, points * weight); 
    res.redirect(`/info?qid=${qid}`); 
});

app.use(function404);
module.exports = app;

// Start server
app.listen(5000, () => { console.log("Running") });

