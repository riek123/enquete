$(document).ready(laadEnqueteLijst);
var enqueteMap={};
var enqueteId;
var geselecteerdeVraagId;
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
     $.ajax({
         cache: false,
         type: 'POST',
         url: 'http://localhost:3000/api',
         data: JSON.stringify(objectOmTeVesturen),
         success: function(data)
         {

            console.log("enqueteOpgeslagen");
            $("#naamEnquete").val("")
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
    $("#enqueteTitel").html(enqueteMap[id].naam);
    enqueteId=id;
     $("#vragenlijst").empty();
              enquete= enqueteMap[enqueteId];
              printVragenlijst(enquete)

 }

 function slaNieuweVraagOp()
 {
    var objectOmTeVesturen = {};
     objectOmTeVesturen.beschrijving = $('#nieuweVraag').val();
         $.ajax({
             cache: false,
             type: 'POST',
             url: 'http://localhost:3000/nieuweVraag/' + enqueteId,
             data: JSON.stringify(objectOmTeVesturen),
             success: function(data)
             {

                console.log("nieuweVraagOpgeslagen");
                $("#nieuweVraag").val("")
                 laadEnqueteLijst();
             },
             error: function(a,b,fout)
             {
                console.log("fout opgetreden", fout);
             },
             contentType: "application/json"
         });
 }
 function selecteerVraag(id)
 {
     console.log(JSON.stringify(enqueteMap[enqueteId]));
    $("#vraagTitel").text(enqueteMap[enqueteId].vragenlijst[id].beschrijving);

    geselecteerdeVraagId = id;
 }
 function printVragenlijst(enquete)
 {
     $.each(enquete.vragenlijst, function(i, vraag){
     // geselecteerdeVraag = vraag;
        $("#vragenlijst")
        .append('<div class="row vragen">' +
        '<div class="col-md-1"><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModal" onclick="selecteerVraag(\'' + vraag.id + '\')"> <span class="glyphicon glyphicon-plus"></span> </button></div>' +
        '<h5 class="col-md-5">' +
        vraag.beschrijving +
        '</h5>' +
        printAntwoorden(vraag.id, vraag.antwoordenlijst) +
        '<div class="col-md-3" style="height: 125px; width: 100px; margin-top: -35px" id="diagram-' + enquete.id + '-' + vraag.id + '"></div>' +
        '</div>')
        id="#diagram-" + enquete.id + "-" + vraag.id;
                console.log("hallo",id)
                data = vulWaarden(vraag.antwoordenlijst)
                taartdiagram(id, data)
        })
 }
 function vulWaarden(antwoordenlijst)
 {
    data=[]
    $.each(antwoordenlijst, function(i, antwoord){
        data.push ({"label":antwoord.beschrijving, "value":antwoord.teller})
        })
        return data;
 }
 function printAntwoorden(vraagId, antwoordenlijst)
 {
    var alleKnoppen = "";
    $.each(antwoordenlijst, function(i, antwoord){
        if (!antwoord.teller)
        {
            antwoord.teller = 0
        }
        var antwoordKnop = '<button class="btn btn-primary col-md-1 btn-sm antwoorden" onclick="kiesAntwoord(\''+ vraagId + '\',\'' + antwoord.code + '\')" type="button">' + antwoord.beschrijving + ' (' + antwoord.teller + ')</button>'
    alleKnoppen = alleKnoppen + antwoordKnop;
    })
    return alleKnoppen
 }
 function slaAntwoordOp()
 {
        var objectOmTeVesturen = {};
         objectOmTeVesturen.beschrijving = $('#nieuwAntwoord').val();
         objectOmTeVesturen.code = $('#nieuwAntwoord').val();
        console.log("aan het opslaan");
         $.ajax({
             cache: false,
             type: 'POST',
             url: 'http://localhost:3000/nieuwAntwoord/' + enqueteId + "/" + geselecteerdeVraagId,
             data: JSON.stringify(objectOmTeVesturen),
             success: function(data)
             {

                console.log("nieuwAntwoordOpgeslagen");
                $("#nieuwAntwoord").val("")
                 laadEnqueteLijst();
             },
             error: function(a,b,fout)
             {
                console.log("fout opgetreden", fout);
             },
             contentType: "application/json"
         });
 }
 function antwoordLeegmaken()
 {
    $("#nieuwAntwoord").val("")
 }

 function kiesAntwoord(vraagId, codeVanHetAntwoord)
 {
    $.ajax({
                 cache: false,
                 type: 'POST',
                 url: 'http://localhost:3000/kiesAntwoord/' + enqueteId + "/" + vraagId + "/" + codeVanHetAntwoord,
                 success: function(data)
                 {

                    console.log("nieuwAntwoordGekozen");
                     laadEnqueteLijst();
                 },
                 error: function(a,b,fout)
                 {
                    console.log("fout opgetreden", fout);
                 },
                 contentType: "application/json"
 })
}
 $(document).ready(function() {
     $('#naamEnquete').keydown(function(event) {
         if (event.keyCode == 13) {
         slaEnqueteOp()
             return false;
          }
     });
 });

 $(document).ready(function() {
           $('#nieuweVraag').keydown(function(event) {
               if (event.keyCode == 13) {
               console.log("sla nieuwe vraag op")
               slaNieuweVraagOp()
                   return false;
                }
           });
       });

$(document).ready(function() {
      $('#nieuwAntwoord').keydown(function(event) {
          if (event.keyCode == 13) {
          slaAntwoordOp()
          $('.modal').modal('hide');
              return false;
           }
      });
  });
  $(document).ready(function() {
  $('#myModal').on('shown.bs.modal', function () {
      $('#nieuwAntwoord').focus();
  })
  })
