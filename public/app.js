const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");
const { initializeApp } =  require("firebase/app");
const { getAnalytics } =  require("firebase/analytics");

const app = express();
const port = 3000;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDq6WL-KC6stXE1R2v-6c_k-0VVndOzquA",
    authDomain: "newsletter-83467.firebaseapp.com",
    projectId: "newsletter-83467",
    storageBucket: "newsletter-83467.appspot.com",
    messagingSenderId: "76838419442",
    appId: "1:76838419442:web:2485def2b4766a003b896b",
    measurementId: "G-Z9CQS9XJR8"
  };
  
// Initialize Firebase
const myApp = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req,res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const options = {
        hostname: "us21.api.mailchimp.com",
        path: `/3.0/lists/d662b5a308/members?skip_merge_validation=false`,
        method: "POST",
        auth: "faiz:6a26acebd4ca57196c6282b6a2971bef-us21",
    };

    const data = {
        email_address: email,
        status: "subscribed",
        merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
        },
    };
    const dataJson = JSON.stringify(data);

    const requestData = https.request(options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else{
            res.sendFile(__dirname + "/failure.html");
        };
        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    requestData.write(dataJson);
    requestData.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(port || process.env.PORT, function(){
    console.log("Server is running on port " + port);
});