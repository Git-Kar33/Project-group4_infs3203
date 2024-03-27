// Import required modules
const express = require('express'); // Import Express.js framework
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const cookieParser = require('cookie-parser'); // Middleware for parsing cookies
const business = require('./business.js'); // Import custom business logic module

// Initialize Express app
let app = express();

// Set up Handlebars as the view engine
const handlebars = require('express-handlebars');
app.set('views', __dirname + "/templates"); // Set directory for views
app.set('view engine', 'handlebars'); // Set Handlebars as the view engine
app.engine('handlebars', handlebars.engine()); // Set Handlebars engine

// Middleware setup
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded()); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use("/static", express.static(__dirname + "/static")); // Serve static files from '/static' directory

// Route for homepage
app.get("/", async (req, res) => {
    res.render('homepage', { layout: "main" }); // Render homepage view
});

// Route for login page
app.get("/login", async (req, res) => {
    let message = req.query.message; // Extract message from query parameter
    res.render('login', { layout: "main", message: message }); // Render login view with optional message
});

// Route for logging out
app.get("/logout", async (req, res) => {
    let key = req.cookies.projectkey; // Get session key from cookie
    await business.deleteSession(key); // Delete session data from database
    res.cookie('projectkey', ''); // Clear session key cookie
    res.redirect('/login'); // Redirect to login page
});

// Route for submitting login form
app.post('/login-form', async (req, res) => {
    let username = req.body.username; // Extract username from form data
    let password = req.body.password; // Extract password from form data
    if (await business.checkLogin(username, password)) { // Check login credentials
        let sessionData = await business.startSession({ username: username }); // Start session
        res.cookie('projectkey', sessionData.sessionKey, { expires: sessionData.expiry }); // Set session key cookie
        res.redirect("/search-record"); // Redirect to search record page
        return;
    }
    res.redirect("/login?message=Invalid Credentials"); // Redirect to login page with error message
});

// Route for searching records
app.get("/search-record", async (req, res) => {
    let sessionId = req.cookies.projectkey; // Get session key from cookie
    let sessionData = await business.getSessionData(sessionId); // Get session data from database
    if (!sessionData) { // If session data does not exist
        let sessionData = await business.startSession({ username: "" }); // Start new session
        res.cookie('projectkey', sessionData.sessionKey, sessionData.expiry); // Set session key cookie
        res.redirect("/login?message=Please Login"); // Redirect to login page with message
        return;
    }
    let message = req.query.message; // Extract message from query parameter
    res.render('searchRecord', { layout: "main", message: message }); // Render search record view with optional message
});

// Route for displaying customer information
app.get("/info", async (req, res) => {
    let sessionId = req.cookies.projectkey; // Get session key from cookie
    let sessionData = await business.getSessionData(sessionId); // Get session data from database
    if (!sessionData) { // If session data does not exist
        let sessionData = await business.startSession({ username: "" }); // Start new session
        res.cookie('projectkey', sessionData.sessionKey, sessionData.expiry); // Set session key cookie
        res.redirect("/login?message=Please Login"); // Redirect to login page with message
        return;
    }
    let qid = req.query.qid; // Extract Qatari ID from query parameter
    if (!(await business.validID(qid))) { // Check if Qatari ID is valid
        res.redirect("/search-record?message=Please enter a valid Qatari id"); // Redirect to search record page with error message
        return;
    }
    let customerInfo = await business.getCustomerDetails(qid); // Get customer details from database
    res.render('customerData', { layout: "main", customerInfo: customerInfo }); // Render customer data view
});

// Route for adding a record
app.post("/addRecord", async (req, res) => {
    let currentDate = new Date(); // Get current date
    let qid = req.body.qid; // Extract Qatari ID from form data
    let wasteType = req.body.wasteType; // Extract waste type from form data
    let category = req.body.category; // Extract category from form data
    let weight = Number(req.body.weight); // Extract weight from form data and convert to number
    let points = await business.getPoints(category); // Get points based on category
    await business.addRecord(currentDate.toLocaleDateString(), qid, wasteType, category, weight, points * weight); // Add record to database
    res.redirect(`/info?qid=${qid}`); // Redirect to customer information page
});

// Custom 404 handler
function function404(req, res) {
    res.status(404).render("error404", { layout: undefined }); // Render 404 error page
}

// Apply 404 handler
app.use(function404);

// Start server
app.listen(5000, () => { console.log("Running") }); // Listen on port 5000 and log a message

