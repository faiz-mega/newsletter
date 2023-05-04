const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const functions = require("firebase-functions");
const https = require("https");
const { initializeApp } = require("firebase/app");  
const { getAuth, GoogleAuthProvider } = require("firebase/auth");

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


const myApp = initializeApp(firebaseConfig);


const auth = getAuth(myApp);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const options = {
    hostname: "us21.api.mailchimp.com",
    path: "/3.0/lists/d662b5a308",
    method: "POST",
    auth: "faiz:7cedeff7be2e7928d9bd17f5820313f8-us21"
  };

  const myRequest = https.request(options, (response) => {

    response.on("data", function (data) {
      const jsonParseData = JSON.parse(data);
      const errorCount = jsonParseData.error_count;
      if (errorCount === 0) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    });

  });

  myRequest.write(jsonData);
  myRequest.end();
});


app.post("/failure", function (req, res) {
  res.redirect("/");
});

exports.app = functions.https.onRequest(app);

// app.listen(port, () => {
//   console.log("Server is running on port " + port);
// });
