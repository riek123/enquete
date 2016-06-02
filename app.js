var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var lijstEnquetes = [];
app.use(express.static('html'));
app.use(bodyParser.json());

app.get('/api', function (req, res) {
   res.send(lijstEnquetes);
});

app.post('/api', function (req, res) {
    console.log(req.body);
    var enquete = req.body;
    enquete.id = lijstEnquetes.length;
    enquete.vragenlijst = [];
    lijstEnquetes.push(enquete);
    res.end();
});

app.post('/nieuweVraag/:id', function(req, res)
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
        res.end();
    });

app.post('/nieuwAntwoord/:enqueteId/:vraagId', function(req, res)
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
                vraag.antwoordenlijst.push(antwoord)
            })
        })
        res.end();
    });

app.listen(3000, function() { console.log('programma is gestart');});