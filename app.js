var express = require('express');
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var db = require('./db');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var lijstEnquetes = [];
var ipAdressenPerVraag = {};
app.use(express.static('html'));
app.use(bodyParser.json());

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

app.get('/api', function (req, res) {
    console.log("request is binnengekomen %s", JSON.stringify(req.body))
   res.send(lijstEnquetes);
});

app.delete('/api/:id',passport.authenticate('basic', { session: false }), function (req, res)
{
    console.log("delete is binnen");
    console.log("id = ", req.params.id);
    var nieuweLijstEnquetes = [];
    lijstEnquetes
    .filter(function(enquete)
            {
                return enquete.id != req.params.id;
            })
            .forEach(function(enquete)
            {
               nieuweLijstEnquetes.push(enquete);
            })
            lijstEnquetes = nieuweLijstEnquetes;
            slaGegevensOp();
    res.end();
});

app.post('/api',passport.authenticate('basic', { session: false }), function (req, res) {
    console.log(req.body);
    var enquete = req.body;
    enquete.id = lijstEnquetes.length;
    enquete.vragenlijst = [];
    lijstEnquetes.push(enquete);
    slaGegevensOp();
    res.end();
});

app.post('/login',passport.authenticate('basic', { session: false }), function (req, res) {
    console.log("Je bent ingelogd");
    res.end("oke");
});

app.post('/nieuweVraag/:id',passport.authenticate('basic', { session: false }), function(req, res)
    {
        console.log(req.body);
        console.log("id = ", req.params.id);
        var vraag = req.body;
        lijstEnquetes
        .filter(function(enquete)
        {
            return enquete.id == req.params.id;
        })
        .forEach(function(enquete)
        {
           vraag.id = enquete.vragenlijst.length;
           vraag.antwoordenlijst = [];
            enquete.vragenlijst.push(vraag);
        })
        slaGegevensOp();
        res.end();
    });

app.post('/nieuwAntwoord/:enqueteId/:vraagId',passport.authenticate('basic', { session: false }), function(req, res)
    {
        console.log(req.body);
        console.log("enquete = ", req.params.enqueteId);
        console.log("vraag = ", req.params.vraagId);
        var antwoord = req.body;
        lijstEnquetes
        .filter(function(enquete)
        {
            return enquete.id == req.params.enqueteId;
        })
        .forEach(function(enquete)
        {
            enquete.vragenlijst
            .filter(function(vraag)
            {
                return vraag.id == req.params.vraagId;
            })
            .forEach(function(vraag)
            {
                antwoord.teller = 0;
                vraag.antwoordenlijst.push(antwoord)
            })
        })
        slaGegevensOp();
        res.end();
    });

function contains(array, element)
{
    for(index = 0; index <= array.length-1; index++)
    {
        if(array[index] === element)
        {
            console.log("true")
            return true;
        }
    }
    console.log("false")
    return false;
}


app.post("/kiesAntwoord/:enqueteId/:vraagId/:antwoordCode" , function(req, res)
{
    console.log(req.body);
    var ipAdress = req.body.ipAdress
    var lijstIpAdressen = ipAdressenPerVraag[req.params.enqueteId + "-" + req.params.vraagId]
    console.log("lijst is", JSON.stringify(lijstIpAdressen))
    if (lijstIpAdressen)
    {
        if (!contains(lijstIpAdressen, ipAdress))
        {
           lijstIpAdressen.push(ipAdress)
        }
        else
        {
            return;
        }
    }
    else
    {
        lijstIpAdressen = []
        lijstIpAdressen.push(ipAdress)
        ipAdressenPerVraag[req.params.enqueteId + "-" + req.params.vraagId] = lijstIpAdressen
    }
    console.log("enquete = ", req.params.enqueteId);
    console.log("vraag = ", req.params.vraagId);
    console.log("antwoord = ", req.params.antwoordCode);
    var antwoord = req.body;
    lijstEnquetes
    .filter(function(enquete)
    {
        return enquete.id == req.params.enqueteId;
    })
    .forEach(function(enquete)
    {
        enquete.vragenlijst
        .filter(function(vraag)
        {
            return vraag.id == req.params.vraagId;
        })
        .forEach(function(vraag)
        {
            vraag.antwoordenlijst
            .filter(function(antwoord)
            {
                return antwoord.code == req.params.antwoordCode;
            })
            .forEach(function(antwoord)
            {
                if (antwoord.teller){
                antwoord.teller++
                }
                else
                {
                antwoord.teller = 1
                }
            })
        })
    })
    slaGegevensOp();
    res.end();
})

function slaGegevensOp()
{
    fs.writeFileSync("enquete.data", JSON.stringify(lijstEnquetes, null, 4))
}
if  (fs.existsSync("enquete.data"))
{
    var data = fs.readFileSync("enquete.data", "utf8")
    lijstEnquetes = JSON.parse(data)
}
else
{
    lijstEnquetes = []
}


app.listen(3000, function() { console.log('programma is gestart');});