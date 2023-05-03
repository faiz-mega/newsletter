const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
const port = 3000;

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
            EMAIL: email,
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

app.listen(port, function(){
    console.log("Server is running on port " + port);
});
