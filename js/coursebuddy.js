var setupselect = document.getElementById('setupselect');
var progcourses = document.getElementById('progcourses');
var class_selection = document.getElementById('class_selection');

function get_request(url, callback) {
  var request = new XMLHttpRequest();
  request.onload = function() {
    callback(this.responseText);
  };
  request.open("get", url, true);
  request.send();
}

function get_json(url, callback) {
  get_request(url, function(json_str) {
    try {
      callback(JSON.parse(json_str));
    }
    catch(e) {
      callback([]);
    }
  });
}

function get_programs(callback) {
  get_json('programs.php', callback);
}

function get_selected_program() {
  return setupselect.options[setupselect.selectedIndex].value;
}

function get_courses(program_id, callback) {
  var url = 'courses.php' + (program_id ? '?program=' + program_id : '');
  get_json(url, callback);
}

function setOnPattern() {
  class_selection.style.display = "none";
}

function setOffPattern() {
  get_courses(get_selected_program(), function(courses) {
    var course;
    progcourses.innerHTML = "";
    for (var i = 0; i < courses.length; i++) {
      course = courses[i];
      var li = document.createElement('li');
      var li_input = document.createElement('input');
      li_input.value = course.id;
      li_input.type = "checkbox";
      li.appendChild(li_input);
      li.innerHTML += ' ' + course.dept + ' ' + course.code + ' - ' + course.name;
      progcourses.appendChild(li);
    }
    class_selection.style.display = "";
  });
}

get_programs(function(programs) {
  for (var i = 0; i < programs.length; i++) {
    var el = document.createElement('option');
    el.innerHTML = programs[i].name;
    el.value = programs[i].id;
    setupselect.appendChild(el);
  }
});
