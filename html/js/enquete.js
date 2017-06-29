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
                enqueteMap[enquete.id]= enquete;
                $("#enqueteLijst").append(sprintf('<a href="#" onclick="selecteerEnquete(%s)" class="list-group-item list-group-item-action">%s</a>', enquete.id, enquete.naam));
         });
         $("#vragenlijst").empty();
          enquete= enqueteMap[enqueteId];
          if (enquete){
         printVragenlijst(enquete)
          }
          if(typeof enqueteId == 'undefined')
          {
            if(result.length > 0)
            {
                selecteerEnquete(result[0].id);
            }
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
            if("oke" == data)
            {
                ingelogd = true
                $(".plusKnop").show();
                $("#loginKnop").hide();
                $("#naamEnquete").show();
                $("#nieuweVraag").show();
                $("#nieuwAntwoord").show();
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
    $("#vraagTitel").text(enqueteMap[enqueteId].vragenlijst[id].beschrijving);

    geselecteerdeVraagId = id;
 }
 function printVragenlijst(enquete)
 {
     $.each(enquete.vragenlijst, function(i, vraag){
        $("#vragenlijst")
        .append('<div style="background-color: rgb(242,242,242); padding: 10px; margin-bottom: 5px"><div class="row"><div class="col-md-8"><div class="row vragen">' +
        sprintf('<div class="col-md-1 plusKnop"><button type="button" class="btn btn-primary btn-xs" data-toggle="modal" data-target="#myModal" onclick="selecteerVraag(\'%s\')"> <span class="glyphicon glyphicon-plus"></span> </button></div>', vraag.id) +
        '<h3 class="col-md-11" style="margin-top: 0px">' +
        vraag.beschrijving +
        '</h3> </div>' +
        printAntwoorden(vraag.id, vraag.antwoordenlijst) +
        '</div>' +
        sprintf('<div class="col-md-4" style="text-align: right; padding-top: 10px; padding-right: 25px" id="diagram-%s-%s"></div></div></div>', enquete.id, vraag.id))
        id=sprintf("#diagram-%s-%s",enquete.id, vraag.id);
                data = vulWaarden(vraag.antwoordenlijst)
                taartdiagram(id, data);
                if(ingelogd == false)
                {
                    $( ".plusKnop" ).hide()
                }
        })
 }
 function vulWaarden(antwoordenlijst)
 {
    data=[]
    $.each(antwoordenlijst, function(i, antwoord){
        if(antwoord.teller > 0)
        {
        data.push ({"label":antwoord.beschrijving, "value":antwoord.teller})
        }
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
        var antwoordKnop = sprintf('<div class="row" style="margin-bottom: 10px"> <span class="col-md-1"></span> <div class="col-md-1"> <button class="btn btn-primary btn-link antwoorden" style="margin: 0" onclick="kiesAntwoord(\'%s\',\'%s\')" type="button"> <span class="glyphicon glyphicon-ok"></span> </button> </div> <h4 class="col-md-10" style="margin-top: 7px"> %s(%s)</h4></div>', vraagId, antwoord.code, antwoord.beschrijving, antwoord.teller)
    alleKnoppen = alleKnoppen + antwoordKnop;
    })
    return alleKnoppen
 }
 function slaAntwoordOp()
 {
        var objectOmTeVesturen = {};
         objectOmTeVesturen.beschrijving = $('#nieuwAntwoord').val();
         objectOmTeVesturen.code = $('#nieuwAntwoord').val();
         $.ajax({
             cache: false,
             type: 'POST',
             url: sprintf('nieuwAntwoord/%s/%s', enqueteId, geselecteerdeVraagId),
             data: JSON.stringify(objectOmTeVesturen),
             success: function(data)
             {
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
                 url: sprintf('kiesAntwoord/%s/%s/%s', enqueteId, vraagId, codeVanHetAntwoord),
                 data: JSON.stringify(objectOmTeVesturen),
                 headers:
                 {
                    "gebruikersId":""
                 },
                 success: function(data)
                 {
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
        ipAdress = data.ip
    });
  });
