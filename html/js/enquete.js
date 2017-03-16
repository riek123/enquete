$(document).ready(laadEnqueteLijst);
var enqueteMap={};
var enqueteId;
var ipAdress;
var geselecteerdeVraagId;
var ingelogd=false;
 function laadEnqueteLijst() {
 $.getJSON("api", function(result){
        enqueteMap={};
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

function login()
 {
     $.ajax({
         cache: false,
         type: 'POST',
         url: 'login',
         success: function(data)
         {
            console.log(data);
            if("oke" == data)
            {
                ingelogd = true
                $("#loginKnop").hide();
                $("#naamEnquete").show();
                $("#nieuweVraag").show();
                $("#nieuwAntwoord").show();
                console.log("enqueteId is", enqueteId)
                if (typeof enqueteId != 'undefined')
                {
                    $("#verwijderKnop").show();
                }
            }
         },
         error: function(a,b,fout)
         {
            console.log("fout opgetreden", fout);
         },
         contentType: "application/json"
     });
 }

 function slaEnqueteOp()
 {
 var objectOmTeVesturen = {};
 objectOmTeVesturen.naam = $('#naamEnquete').val();
     $.ajax({
         cache: false,
         type: 'POST',
         url: 'api',
         data: JSON.stringify(objectOmTeVesturen),
         success: function(data)
         {

            console.log("enqueteOpgeslagen");
            $("#naamEnquete").val("")
             laadEnqueteLijst();
            $("#enqueteOpslaanKnop").hide();
         },
         error: function(a,b,fout)
         {
            console.log("fout opgetreden", fout);
         },
         contentType: "application/json"
     });
 }
 function verwijderEnquete()
 {
    $.ajax({
             cache: false,
             type: 'DELETE',
             url: 'api/' + enqueteId,
             success: function(data)
             {

                console.log("enquete verwijderd");
                $("#naamEnquete").val("")
                $("#enqueteTitel").html("")
                $("#verwijderKnop").hide();
                $("#vragenlijst").empty();
                $("#vraagVeld").hide();
                $("#antwoordOpslaanKnop").hide();
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
    if(ingelogd)
    {
    $("#verwijderKnop").show();
    }
    $("#vraagVeld").show();
    $("#vraagOpslaanKnop").hide();
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
             url: 'nieuweVraag/' + enqueteId,
             data: JSON.stringify(objectOmTeVesturen),
             success: function(data)
             {

                console.log("nieuweVraagOpgeslagen");
                $("#nieuweVraag").val("")
                $("#vraagOpslaanKnop").hide();
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
             url: 'nieuwAntwoord/' + enqueteId + "/" + geselecteerdeVraagId,
             data: JSON.stringify(objectOmTeVesturen),
             success: function(data)
             {

                console.log("nieuwAntwoordOpgeslagen");
                $("#nieuwAntwoord").val("")
                $("#antwoordOpslaanKnop").hide();
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
    var objectOmTeVesturen = {};
             objectOmTeVesturen.ipAdress = ipAdress;
    $.ajax({
                 cache: false,
                 type: 'POST',
                 url: 'kiesAntwoord/' + enqueteId + "/" + vraagId + "/" + codeVanHetAntwoord,
                 data: JSON.stringify(objectOmTeVesturen),
                 headers:
                 {
                    "gebruikersId":""
                 },
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
          titel = $('#naamEnquete').val();
         if (event.keyCode == 13 && titel.length > 0) {
         slaEnqueteOp()
             return false;
          }
     });
 });

 $(document).ready(function() {
     $('#naamEnquete').keyup(function(event) {
     titel = $('#naamEnquete').val();
     if (titel.length > 0)
     {
        $("#enqueteOpslaanKnop").show();
     }
     else
     {
        $("#enqueteOpslaanKnop").hide();
     }
     });
 });

$(document).ready(function() {
     $('#nieuweVraag').keyup(function(event) {
     vraag = $('#nieuweVraag').val();
     if (vraag.length > 0)
     {
        $("#vraagOpslaanKnop").show();
     }
     else
     {
        $("#vraagOpslaanKnop").hide();
     }
     });
 });

 $(document).ready(function() {
           $('#nieuweVraag').keydown(function(event) {
           vraag = $('#nieuweVraag').val();
               if (event.keyCode == 13 && vraag.length > 0) {
               console.log("sla nieuwe vraag op")
               slaNieuweVraagOp()
                   return false;
                }
           });
       });

$(document).ready(function() {
      $('#nieuwAntwoord').keydown(function(event) {
          antwoord = $('#nieuwAntwoord').val();
            if (event.keyCode == 13 && antwoord.length > 0) {
            slaAntwoordOp()
            $('.modal').modal('hide');
                return false;
               }
        });
    });

    $(document).ready(function() {
         $('#nieuwAntwoord').keyup(function(event) {
         antwoord = $('#nieuwAntwoord').val();
         if (antwoord.length > 0)
         {
            $("#antwoordOpslaanKnop").show();
         }
         else
         {
            $("#antwoordOpslaanKnop").hide();
         }
         });
     });

  $(document).ready(function() {
  $('#myModal').on('shown.bs.modal', function () {
      $('#nieuwAntwoord').focus();
  })
  })
  $(document).ready(function() {
     $("#nieuwAntwoord").hide();
     $("#nieuweVraag").hide();
     $("#naamEnquete").hide();
     $("#verwijderKnop").hide();
     $("#enqueteOpslaanKnop").hide();
     $("#vraagVeld").hide();
     $("#antwoordOpslaanKnop").hide();
  })

  $(document).ready(function ()
  {
    $.getJSON("http://jsonip.com", function (data)
    {
        console.log(data)
        ipAdress = data.ip
    });
  });
