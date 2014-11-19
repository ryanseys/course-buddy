function install() {
  add_message("Installing coursebuddy...Please wait, this will take a momemnt....", true);
  request({
    method: 'post',
    url:'install.php'
  }, function(result) {
    add_message(result, true);
    setTimeout(function() { window.location = "index.html"}, 5000);
  });
}

function uninstall() {
  add_message("Uninstalling coursebuddy...", false);
  request({
    method: 'post',
    url: 'uninstall.php',
  }, function(result) {
    add_message(result, false);
    setTimeout(function() { window.location = "install.html"}, 5000);
  });
}

function add_message(message, install) {
  var message_element = document.createElement('p');
  message_element.innerHTML = message;
  document.getElementById(install ? "install_progress" : "uninstall_progress").appendChild(message_element);
}