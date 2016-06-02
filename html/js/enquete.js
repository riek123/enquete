$(document).ready(laadEnqueteLijst);

 function laadEnqueteLijst() {
 $.getJSON("http://localhost:3000/api", function(result){
         $("#enqueteLijst").empty();
         $.each(result, function(i, field){
            console.log(field);
            $("#enqueteLijst").append('<li><a href="#">' + field.naam + '</a></li>');
         });
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