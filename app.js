const express =  require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.get("/",function(req,res){

  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
  const city = req.body.cityName;
  const apiKey = "76cab7bf755ecd05e67990894597a890";
  const url = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&units=metric&appid="+apiKey;
  https.get(url, function(response){
    if(response.statusCode === 200)
    {
      response.on("data",function(data){
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherinfo = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgURL = "http://openweathermap.org/img/wn/"+icon+"@2x.png"
      res.write("<h1>Temp in "+ city + ": " + temp + " degree Celsius. </h1>");
      res.write("<p>The weather is "+weatherinfo+"</p>");
      res.write("<img src="+imgURL+">");
      res.send();
          });
    }
    else
    {
      res.sendFile(__dirname + "/failure.html");
    }
  });
});

app.post("/failure",function(req,res){
  res.redirect("/");
});

app.listen(process.env.PORT || 3000 ,function(){

  console.log("Server running");
});
