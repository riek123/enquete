var express = require('express');
var fs = require('fs');
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
    slaGegevensOp();
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
        slaGegevensOp();
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
                antwoord.teller = 0;
                vraag.antwoordenlijst.push(antwoord)
            })
        })
        slaGegevensOp();
        res.end();
    });
app.post("/kiesAntwoord/:enqueteId/:vraagId/:antwoordCode" , function(req, res)
{
    console.log(req.body);
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