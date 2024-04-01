const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const business = require('./business.js')

let app = express()
const handlebars = require('express-handlebars')
app.set('views', __dirname+"/templates")
app.set('view engine', 'handlebars')
app.engine('handlebars', handlebars.engine())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use("/static",express.static(__dirname+"/static"));

function function404(req, res) {
    res.status(404).render("error404", {layout:undefined})
}

app.get("/", async(req,res)=>{
    res.render('homepage',{layout:"main"})
})

app.get("/login", async(req,res)=>{
    let message = req.query.message;
    res.render('login',{layout:"main", message: message})
})

app.get("/logout",async(req,res)=>{
    let key = req.cookies.projectkey
    await business.deleteSession(key)
    res.cookie('projectkey','')
    res.redirect('/login')
})

app.post('/login-form',async(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;
    if (await business.checkLogin(username, password)){
        let sessionData = await business.startSession({
            username:username
        })
        res.cookie('projectkey',sessionData.sessionKey,{expires:sessionData.expiry})
        res.redirect("/search-record")
        return
    }
    res.redirect("/login?message=Invalid Credentials")
})

app.get("/search-record", async(req,res)=>{
    let sessionId = req.cookies.projectkey;
    let sessionData = await business.getSessionData(sessionId);

    if(!sessionData){
        let sessionData =await business.startSession({
            username:""
        });
        res.cookie('projectkey',sessionData.sessionKey,sessionData.expiry);
        res.redirect("/login?message=Please Login")
        return 
    }
    let message = req.query.message;
    res.render('searchRecord',{layout:"main", message: message})
})

function isEmptyArray(array){
    return array.length == 0;
}

function totalDayPoints(data){
    let dailyPoints = 0
    for (let i of data){
        dailyPoints += i.points
    }
    return dailyPoints
}

app.get("/info", async(req,res)=>{
    let sessionId = req.cookies.projectkey;
    let sessionData = await business.getSessionData(sessionId);

    if(!sessionData){
        let sessionData =await business.startSession({
            username:""
        });
        res.cookie('projectkey',sessionData.sessionKey,sessionData.expiry);
        res.redirect("/login?message=Please Login")
        return 
    }
    let qid = req.query.qid
    if(!(await business.validID(qid))){
        res.redirect("/search-record?message=Please enter a valid Qatari id")
        return
    }
    let customerInfo = await business.getCustomerDetails(qid)
    let newDateRecord = customerInfo.dateRecord.reverse()
    customerInfo.dateRecord = newDateRecord.slice(0, 4)
    res.render('customerData',
    {
        layout:"main", customerInfo: customerInfo,
        helpers: {isEmptyArray, totalDayPoints}
    })
})

app.put("/api/:qid/info", async(req,res)=>{
    let currentDate = new Date();

    let qid = req.params.qid
    let wasteType = req.body.wasteNameInput
    let category = req.body.category
    let weight = Number(req.body.weightInput)

    let points = await business.getPoints(category);
    await business.addRecord(currentDate.toLocaleDateString(), qid, wasteType, category, weight, points*weight)
    res.send("ok")
})

app.get("/api/:qid/user", async(req,res)=>{
    let customerInfo = await business.getCustomerDetails(req.params.qid)
    res.send(customerInfo)
})

app.patch(`/api/:qid/info`, async(req,res)=>{
    await business.updatePoints(req.params.qid, req.body.points)
    res.send("ok")
})

app.use(function404)
app.listen(5000, () => { console.log("Running")})
