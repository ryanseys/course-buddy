var RETRY_LIMIT = 3;
var retries = 0;
function install() {
  add_message("Installing coursebuddy...", true);
  add_message("<span id='spinner'><img src='img/spinner.gif' /> Please wait, this will take a moment....</span>", true)
  request({
    method: 'post',
    url:'install.php'
  }, function(result) {
    document.getElementById('spinner').style.display = 'none';
    if (result.indexOf('fail') != -1) {
      if(retries++ < RETRY_LIMIT) {
        add_message("Coursebuddy installation ran into a problem, going to retry:", true);
        install();
      } else {
        add_message("Coursebuddy installation failed. Please update your config and try again.", true);
      }
    } else {
      add_message(result, true);
      setTimeout(function() { window.location = "index.html"}, 2000);
    }
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
