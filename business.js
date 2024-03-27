const persistence = require("./persistence.js") 
const crypto = require("crypto") 

// Function to insert user data
async function insertUser(data){
    await persistence.insertUser(data)
}

// Function to insert customer data
async function insertCustomer(data){
    await persistence.insertCustomer(data)
}

// Function to retrieve customer details
async function getCustomerDetails(qid){
    let customerData = await persistence.getCustomerDetails(qid)
    if(!customerData){
        await persistence.insertCustomer({qid: qid, points: 0, dateRecord: []})
        return await persistence.getCustomerDetails(qid)
    }
    else{
        return customerData
    }
}

// Function to check login credentials
async function checkLogin(username, password) {
    let userDetails = await persistence.getUserDetails(username);
    if(!userDetails){
      return false
    }
    if (userDetails.password == password){
        return true;
    }
    return false
}

// Function to validate identification number
async function validID(qid){
    if(qid.length == 11 && !isNaN(qid)){
        if(qid[0] == 2 || qid[0] == 3){
            // List of ISO country codes for reduced validation time
            if(["004", "008", "012", "016", "020", "024", "660", "010", "028", "032","051", "533", "036", "040", "031", "044", "048", "050", "052", "112","056", "084", "204", "060", "064", "068", "535", "070", "072", "074","076", "086", "096", "100", "854", "108", "132", "116", "120", "124","136", "236", "140", "144", "152", "156", "162", "166", "170", "174","180", "184", "188", "191", "192", "196", "203", "208", "212", "214","218", "222", "226", "231", "232", "233", "234", "238", "239", "242","246", "248", "250", "254", "258", "260", "262", "266", "268", "270","276", "280", "284", "288", "290", "293", "296", "300", "304", "308","312", "316", "320", "324", "328", "332", "334", "336", "340", "344","348", "352", "356", "360", "364", "368", "372", "376", "380", "384","388", "392", "396", "400", "404", "408", "410", "414", "418", "422","426", "428", "430", "434", "438", "440", "442", "446", "450", "454","458", "462", "466", "470", "474", "478", "480", "484", "488", "492","496", "498", "500", "504", "507", "512", "516", "520", "524", "528","531", "534", "537", "540", "548", "554", "558", "562", "566", "570","574", "578", "580", "581", "583", "584", "585", "586", "588", "591","598", "600", "604", "608", "612", "616", "620", "624", "626", "630","634", "638", "642", "643", "646", "652", "654", "659", "662", "666","670", "674", "678", "682", "686", "68"].includes(qid.slice(3, 6)))
                return true;
        }
    }
    return false;
}

// Function to add waste disposal record
async function addRecord(date, qid, wasteType, category, weight, pointsReceived){
    await persistence.addRecord(date, qid, wasteType, category, weight, pointsReceived)
}

// Function to get points associated with waste category
async function getPoints(category){
    if (category == "Paper"){
        return 1
    }
    else if (category == "Plastic"){
        return 2
    }
    else if (category == "Glass"){
        return 3
    }
    else if (category == "Metal"){
        return 3
    }
    else if (category == "Textile"){
        return 2
    }
    else if (category == "Yard Waste"){
        return 1
    }
}

// Function to start a new session
async function startSession(data) {
    let sessionId = crypto.randomUUID();
    let sessionData = {
        sessionKey:sessionId,
        expiry: new Date(Date.now() + 1000*60*60),
        data:data
    }
    await persistence.saveSession(sessionData.sessionKey,sessionData.expiry,sessionData.data)
    return sessionData;
}

// Function to retrieve session data
async function getSessionData(key) {
    return await persistence.getSessionData(key);
}

// Function to delete session data
async function deleteSession(key){
  return await persistence.deleteSession(key);
}

module.exports={
    insertUser, insertCustomer, getCustomerDetails, validID, checkLogin, addRecord, getPoints, startSession, getSessionData, deleteSession
}
