var token = "";
var tuid = "";
var ebs = "";

// because who wants to type this every time?
var twitch = window.Twitch.ext;

// create the request options for our Twitch API calls
var requests = {
    setUpload: upload('POST', 'upload')
};

function upload(type, method, file) {
  return {
      type: type,
      url: 'https://localhost:8081/api/' + method,
      success: logSuccess,
      error: logError,
      data: {
        file: file
      },
      contentType: false,
      processData: false,
  }
}

function createRequest(type, method) {
    return {
        type: type,
        url: 'https://localhost:8081/api/' + method,
        success: logSuccess,
        error: logError
    }
}

function setAuth(token) {
    Object.keys(requests).forEach((req) => {
        twitch.rig.log('Setting auth headers');
        requests[req].headers = { 'Authorization': 'Bearer ' + token }
    });
}

twitch.onContext(function(context) {
    twitch.rig.log(context);
});

twitch.onAuthorized(function(auth) {
    // save our credentials
    token = auth.token;
    tuid = auth.userId;

    setAuth(token);
    $.ajax(requests.get);
});

function logError(_, error, status) {
  twitch.rig.log('EBS request returned '+status+' ('+error+')');
}

function logSuccess(hex, status) {
  // we could also use the output to update the block synchronously here,
  // but we want all views to get the same broadcast response at the same time.
  twitch.rig.log('EBS request returned '+hex+' ('+status+')');
}

$(function() {
    $('#upload').click(function() {
      twitch.rig.log('clicked upload button');
      var fd = new FormData();
      var files = $('#file-submission')[0].files[0];
      fd.append('image',files);
      console.log('here');
      console.log(fd.get('image'));
      $.ajax(upload('POST', 'upload', fd.get('image')))
        .done(function(val) {
          $('#test').text(val);
        })
    })

    // listen for incoming broadcast message from our EBS
    twitch.listen('broadcast', function (target, contentType, color) {
        twitch.rig.log('Received broadcast color');
    });
});
