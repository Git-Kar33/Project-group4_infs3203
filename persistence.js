const mongodb = require('mongodb')

let client = undefined
let db = undefined
let user = undefined
let session = undefined
let customerData = undefined
let pointHistory = undefined


async function connectDatabase() {
    if (!client) {
        client = new mongodb.MongoClient("mongodb+srv://60102524:12class34@cluster0.u1ve744.mongodb.net/")
        db = client.db('INFS3203')
        user = db.collection('user')
        customerData = db.collection('customerData')
        session = db.collection('SessionData')
        pointHistory = db.collection('pointsData')
        await client.connect()
    }
}

async function insertUser(data){
    await connectDatabase();
    await user.insertOne(data)
}

async function insertCustomer(data){
    await connectDatabase();
    await customerData.insertOne(data)
}

async function insertPointData(data){
    await connectDatabase();
    await pointHistory.insertOne(data)
}

async function getUserDetails(userName) {
    await connectDatabase();
    let users = await user.find({username:userName});
    let userDetails = await users.toArray();
    return userDetails[0];
}

async function getPointHistory(qid) {
    await connectDatabase();
    let userPointHistory = await pointHistory.find({qid:qid}).sort({date: -1});
    let userPointHistoryData = await userPointHistory.toArray();
    return userPointHistoryData;
}

async function getCustomerDetails(qid) {
    await connectDatabase();
    let customer = await customerData.find({qid:qid});
    let customerDetails = await customer.toArray();
    return customerDetails[0];
}

async function addRecord(date, qid, wasteType, category, weight, pointsRecieved){
    await connectDatabase();
    let customerDetails = await getCustomerDetails(qid);
    customerDetails.totalPoints += pointsRecieved
    for (let c of customerDetails.dateRecord){
        if (c.date==date){
            c.data.push({wasteType: wasteType, category:category, weight:weight, points: pointsRecieved})
            await customerData.updateOne({qid: qid, "dateRecord.date": date}, {$set:{"dateRecord.$.data": c.data, totalPoints: customerDetails.totalPoints}})
            return
        }
    }
    await customerData.updateOne({qid: qid}, {$push: {"dateRecord": {date: date, data: [{wasteType: wasteType, category:category, weight:weight, points: pointsRecieved}]}}, $set:{totalPoints: customerDetails.totalPoints}})
}

async function updatePoints(qid, points){
    await connectDatabase();
    await customerData.updateOne({qid: qid}, {$set: {totalPoints: points}})
}

async function saveSession(uuid, expiry, data) {
    await connectDatabase();
    let sessionData = {
        sessionKey:uuid,
        expiry: expiry,
        data:data
    }
    await session.insertOne(sessionData)
}

async function getSessionData(key) {
    await connectDatabase();
    let sessiond= await session.find({sessionKey:key}) 
    let sessionData = await sessiond.toArray();

    return sessionData[0];
}

async function deleteSession(key){
    await connectDatabase();
    await session.deleteOne({sessionKey:key});
}

module.exports={
    insertUser, insertCustomer, insertPointData, getUserDetails, getPointHistory, addRecord, getCustomerDetails, updatePoints, saveSession, getSessionData, deleteSession
}

//Testing
