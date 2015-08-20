$( document ).ready(function() {
  $.ajax({
    url: 'https://api.github.com/repos/Unitech/PM2/contributors?per_page=100',
    dataType: 'jsonp',
    success: function(dataWeGotViaJsonp){
      var data = dataWeGotViaJsonp.data;
      data.forEach(function(result) {
        var id = result.id;
        var login = result.login;
        var contributions = result.contributions;
        var avatar = result.avatar_url;
        var div = $('<div id="'+id+'" class="col-xs-6 col-md-3 img-contributors"></div>');
        div.prepend('<img src="'+avatar+'" />');
        div.prepend('<div class="col-xs-6 col-md-3 hover-contributor">' +
          '<p>'+login+'</p>' +
          '<p>Contributions: '+contributions+'</p>' +
          '</div>');
        div.appendTo('.container-contributors .container .row');
      });
      $(".img-contributors").hover(function () {
        $('.hover-contributor', this).show();
      }, function () {
        $('.hover-contributor', this).hide();
      });
    }
  }); 
});
