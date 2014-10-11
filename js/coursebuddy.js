var setupselect = document.getElementById('setupselect');

function get_request(url, callback) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    callback(this.responseText);
  };
  request.open("get", url, true);
  request.send();
}

function get_programs(callback) {
  get_request('programs.php', function(json_str) {
    try {
      callback(JSON.parse(json_str));
    }
    catch(e) {
      callback([]);
    }
  });
}

get_programs(function(data) {
  for (var i = 0; i < data.length; i++) {
    var el = document.createElement('option');
    el.innerHTML = data[i].name;
    setupselect.appendChild(el);
  }
});
