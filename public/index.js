function createTableBody(data){
    return new Promise(resolve=>{
    $('#results').empty();
    $('#results').append("<tbody id='stuff'></tbody>");
    
    data.forEach((element) => {
      $('#stuff').append("<tr><td class='torrent_title'>"+element.title+"</td><td><button data='"+element.link+"' id='"+element.title+"' class='link'>click to get torrent</button><hr>"+element.link+"</td><td><button class='favorite' data-link='"+element.link+"' data-title='"+element.title+"'>add to favorites</button></td</tr>");

    });
    resolve('complete');
    })


  }

  $("#search-button").on('click',function(){
    var searchy = $("#search").val().trim();
    console.log("loading...")
    $.getJSON("/api/search/"+searchy,function(data){
        console.log(data);
        createTableBody(data.data).then(function(){
            $(".link").on('click',function(){
                let link = $(this).attr('data');
                console.log($(this).val())
                //console.log(link)
            //     $.getJSON("/api/getTorrent/"+link,function(data){
            //       console.log(data);
            //       // createTableBody(data.data);
            //   })
              obj={link:link}
              console.log(obj)
              $.ajax({
                url: "/api/getTorrent",
                type: "post",
                data: obj,
                dataType: 'json'
              }).then(function(dat){
                  console.log(dat.data[0]);
                  window.location.href=dat.data[0];
              })
              })
        });
    })
  })
