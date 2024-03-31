// MongoDB connection module
const mongodb = require('mongodb');

// MongoDB client and database initialization
let client = undefined;
let db = undefined;
let user = undefined;
let session = undefined;
let customerData = undefined;

// Function to connect to MongoDB database
async function connectDatabase() {
    if (!client || !client.isConnected()) {
        client = new mongodb.MongoClient("mongodb+srv://60084212:12class34@cluster0.homew0b.mongodb.net/");
        db = client.db('INFS3203');
        user = db.collection('user');
        customerData = db.collection('customerData');
        session = db.collection('SessionData');
        await client.connect();
    }
}

// Function to insert user data into the database
async function insertUser(data) {
    await connectDatabase();
    await user.insertOne(data);
}

// Function to insert customer data into the database
async function insertCustomer(data) {
    await connectDatabase();
    await customerData.insertOne(data);
}

// Function to get user details from the database based on username
async function getUserDetails(userName) {
    await connectDatabase();
    let users = await user.find({username:userName});
    let userDetails = await users.toArray();
    return userDetails[0];

// Function to get customer details from the database based on qid
async function getCustomerDetails(qid) {
 await connectDatabase();
    let customer = await customerData.find({qid:qid});
    let customerDetails = await customer.toArray();
    return customerDetails[0]; 
}

