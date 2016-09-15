$(document).ready(laadEnqueteLijst);
var enqueteMap={};
var enqueteId;
var geselecteerdeVraag;
 function laadEnqueteLijst() {
 $.getJSON("http://localhost:3000/api", function(result){
         $("#enqueteLijst").empty();
         $.each(result, function(i, enquete){
            console.log(enquete);
            enqueteMap[enquete.id]= enquete;
            $("#enqueteLijst").append('<li><a href="#" onclick="selecteerEnquete(' + enquete.id + ')">' + enquete.naam + '</a></li>');
         });
         $("#vragenlijst").empty();
          enquete= enqueteMap[enqueteId];
          if (enquete){
         printVragenlijst(enquete)
          }
     });
 }

 function slaEnqueteOp()
 {
 var objectOmTeVesturen = {};
 objectOmTeVesturen.naam = $('#naamEnquete').val();
 console.log("aan het opslaan");
     $.ajax({
         cache: false,
         type: 'POST',
         url: 'http://localhost:3000/api',
         data: JSON.stringify(objectOmTeVesturen),
         success: function(data)
         {

            console.log("enqueteOpgeslagen");
             laadEnqueteLijst();
         },
         error: function(a,b,fout)
         {
            console.log("fout opgetreden", fout);
         },
         contentType: "application/json"
     });
 }

 function selecteerEnquete(id)
 {
    console.log("Hij werkt." + id);
    $("#enqueteTitel").html(enqueteMap[id].naam);
    enqueteId=id;
     $("#vragenlijst").empty();
              enquete= enqueteMap[enqueteId];
              printVragenlijst(enquete)

 }

 function slaNieuweVraagOp()
 {
    console.log("Je hebt op de knop gedrukt.");
    var objectOmTeVesturen = {};
     objectOmTeVesturen.beschrijving = $('#nieuweVraag').val();
     console.log("aan het opslaan");
         $.ajax({
             cache: false,
             type: 'POST',
             url: 'http://localhost:3000/nieuweVraag/' + enqueteId,
             data: JSON.stringify(objectOmTeVesturen),
             success: function(data)
             {

                console.log("nieuweVraagOpgeslagen");
                 laadEnqueteLijst();
             },
             error: function(a,b,fout)
             {
                console.log("fout opgetreden", fout);
             },
             contentType: "application/json"
         });
 }
 function vulVraagTitel(vraag)
 {
    $("#vraagTitel").text(vraag)
 }
 function printVragenlijst(enquete)
 {
     $.each(enquete.vragenlijst, function(i, vraag){
     geselecteerdeVraag = vraag;
                            $("#vragenlijst")
                            .append('<div class="row vragen">' +
                            '<div class="col-md-1"><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModal" onclick="vulVraagTitel(\'' + vraag.beschrijving + '\')"> <span class="glyphicon glyphicon-plus"></span> </button></div>' +
                            '<h5 class="col-md-5">' +
                            vraag.beschrijving +
                            '</h5>' +
                            printAntwoorden(vraag.antwoordenlijst) +
                            '<div class="col-md-3"></div>' +
                            '</div>')
                            })
 }
 function printAntwoorden(antwoordenlijst)
 {
    var alleKnoppen = "";
    $.each(antwoordenlijst, function(i, antwoord){
        console.log(antwoord.beschrijving)
        var antwoordKnop = '<button class="btn btn-primary col-md-1 btn-sm antwoorden" onclick="" type="button">' + antwoord.beschrijving + '</button>'
    alleKnoppen = alleKnoppen + antwoordKnop;
    })
    return alleKnoppen
 }
 function slaAntwoordOp()
 {
    console.log("geselecteerde enquete " + enqueteId)
    console.log("geselecteerde vraag " + geselecteerdeVraag.id)
    console.log($("#nieuwAntwoord").val())

 }