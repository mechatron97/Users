
var userListData = [];

$(document).ready(function() {

  populateTable();

  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

  $('#btnAddUser').on('click', addUser);

  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

});

function populateTable() {

  var tableContent = '';

  $.getJSON( '/users/userlist', function( data ) {

    userListData = data;

    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.email + '" title="Show Details">' + this.email + '</a></td>';
      tableContent += '<td>' + this.role + '</td>';
      tableContent += '<td>' + this.team + '</td>';
      tableContent += '<td>' + this.type + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event) {

  event.preventDefault();

  var thisUserName = $(this).attr('rel');

  var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

  var thisUserObject = userListData[arrayPosition];

  $('#userInfoEmail').text(thisUserObject.email);
  $('#userInfoRole').text(thisUserObject.role);
  $('#userInfoTeam').text(thisUserObject.team);
  $('#userInfoType').text(thisUserObject.type);

};

function addUser(event) {
  event.preventDefault();

  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') { errorCount++; }
  });

  if(errorCount === 0) {

    var newUser = {
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'role': $('#addUser fieldset input#inputUserRole').val(),
      'team': $('#addUser fieldset input#inputUserTeam').val(),
      'type': $('#addUser fieldset input#inputUserType').val(),
    }

    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function( response ) {

      if (response.msg === '') {

        $('#addUser fieldset input').val('');

        populateTable();

      }
      else {

        alert('Error: ' + response.msg);

      }
    });
  }
  else {

    alert('Please fill in all fields');
    return false;
  }
};

function deleteUser(event) {

  event.preventDefault();

  var confirmation = confirm('Are you sure you want to delete this user?');

  if (confirmation === true) {

    $.ajax({
      type: 'DELETE',
      url: '/users/deleteuser/' + $(this).attr('rel')
    }).done(function( response ) {

      if (response.msg === '') {
      }
      else {
        alert('Error: ' + response.msg);
      }

      populateTable();

    });

  }
  else {

    return false;

  }

};