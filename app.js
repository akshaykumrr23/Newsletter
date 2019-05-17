//jshint esversion:6
const express = require("express");     //express is a library
const bodyParser = require("body-parser");  //body-parser is a middleware.
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

/*it is used so that our images & css files which are static can be loded on the localhost,
also by this method we can use both static and remote located links(bootstrap) at the same time. */

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html"); //syntax used for connecting .html files to our localhost
});

//Route that recieves POST request from our website to "/"
app.post("/", function(req,res){

  var firstName = req.body.fName;
  var lastName = req.body.lName;
  var email = req.body.email;

  //Posting data entered by user to mailchimp !
  var data = {
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

  var jsonData = JSON.stringify(data);

  var options = {
    url:"https://us20.api.mailchimp.com/3.0/lists/b7e39146de",
    method: "POST",
    headers: {
      "Authorization": "Akshay af4e03bd2bed73636bde762b8a917204-us20"
    },
    body: jsonData
  };

  request(options, function(error, response,body){
  if (error) {
    res.sendFile(__dirname + "/failure.html");
  } else{
    if(response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  }
  });

});

// It acts as callback function which will redirect the user to the homepage when there is log in error!.

app.post("/failure", function(req, res){
  res.redirect("/");
});

//Tell our app to listen on port 3000
app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000");
});


//af4e03bd2bed73636bde762b8a917204-us20 -->API Key(abandone fake subscribers)
//b7e39146de -->List ID(this id help mailchimp to add or remove subscribers from this list)
