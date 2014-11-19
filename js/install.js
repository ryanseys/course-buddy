function install() {
  add_message("Installing coursebuddy...", true);
  add_message("<span id='spinner'><img src='img/spinner.gif' /> Please wait, this will take a momemnt....</span>", true)
  request({
    method: 'post',
    url:'install.php'
  }, function(result) {
    document.getElementById('spinner').style.display = 'none';
    add_message(result, true);
    setTimeout(function() { window.location = "index.html"}, 2000);
  });
}

function uninstall() {
  add_message("Uninstalling coursebuddy...", false);
  request({
    method: 'post',
    url: 'uninstall.php',
  }, function(result) {
    add_message(result, false);
    setTimeout(function() { window.location = "install.html"}, 2000);
  });
}

function add_message(message, install) {
  var message_element = document.createElement('p');
  message_element.innerHTML = message;
  document.getElementById(install ? "install_progress" : "uninstall_progress").appendChild(message_element);
}