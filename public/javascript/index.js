
// Display articles

$.getJSON('/articles', function(data) {

  var articlesHTML = "";

  for (var i = 0; i < data.length; i++) {
    
    articlesHTML += '<div class="panel panel-primary">';
    articlesHTML += ' <div class="panel-heading">';
    articlesHTML += '   <p data-id="' + data[i]._id + '">'+ data[i].title + '</p>';
    articlesHTML += ' </div>';
    articlesHTML += ' <div class="panel-body">';
    articlesHTML += '   <a href="' + data[i].link + '">'+ data[i].link + '</a>';
    articlesHTML += ' </div>';
    articlesHTML += '</div>';

  }

  $('#articles').append(articlesHTML);

});

// When article header is clicked

$(document).on('click', 'p', function() {

  $('#notes').empty();

  var thisId = $(this).attr('data-id');

  $.ajax({

    method: "GET",
    url: "/articles/" + thisId,

  })

  .done(function( data ) {

    $('#deleteNotes').empty();

    $('#notes').append('<h2>Add Note: <h2><div class="jumbotron" id="anitext"><h4 id="dataTitle">' + data.title + '</h4></div>');
    $('#notes').append('<h4>Title of Note</h4><input id="titleinput" class="form-control" name="title" >');
    $('#notes').append('<h4>Body of Note</h4><textarea id="bodyinput" class="form-control" name="body"></textarea>');
    $('#notes').append('<br><button type="button" class="btn btn-success" data-id="' + data._id + '" id="savenote">Save Note</button>');

    if(data.note) {

      $('#titleinput').val(data.note.title);
      $('#bodyinput').val(data.note.body);
      $('#deleteNotes').append('<table id="dataTable" class="table"><thead><h2>Existing Note:</h2></tead><tbody id="dataBody"></tbody></table><button id="deleteButton" class="btn btn-danger" data-id="' + data.note._id + '">Delete Note</button>')
      $('#dataBody').append('<tr class="warning"><td><strong>' + data.note.title + '</strong></td></tr><tr class="success"><td>' + data.note.body + '</td></tr>');

    } else {

      $('#deleteNotes').append('<div class="jumbotron"><h2>No note exist for this article, write some!</h2></div>')

    }
  });
});

// When delete button is clicked

$(document).on('click', '#deleteButton', function(){

  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/removenote/" + thisId
  })

  .done(function() {
      $('#titleinput').val("");
      $('#bodyinput').val("");
      $('#deleteNotes').empty();
      $('#deleteNotes').append('<div class="jumbotron"><h2>Click on an article header to see if note already exist!</h2></div>');
  });

});

// When save button is clicked

$(document).on('click', '#savenote', function() {

  var thisId = $(this).attr('data-id');

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $('#titleinput').val(),
      body: $('#bodyinput').val()
    }
  })

  .done(function( data ) {
    console.log(data);
    $('#notes').empty();
    $('#notes').append('<div class="jumbotron"><h2>Click on article header to write note!</h2></div>');
  });

  $('#titleinput').val("");
  $('#bodyinput').val("");
});