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
