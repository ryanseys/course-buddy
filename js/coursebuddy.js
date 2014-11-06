var setupselect = document.getElementById('setupselect');
var progcourses = document.getElementById('progcourses');
var class_selection = document.getElementById('class_selection');

function get_json(url, callback) {
  request({
    method: 'get',
    url: url
  }, function(json_str) {
    try {
      callback(JSON.parse(json_str));
    }
    catch(e) {
      callback([]);
    }
  });
}

function request(options, callback) {
  options = options || {};
  var req = new XMLHttpRequest();

  req.open(options.method, options.url, true);
  req.onload = function() {
    callback(this.responseText);
  };

  req.send(options.data);
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
  class_selection.style.display = 'none';
  term_selection.style.display = '';
}

function postJSON(url, data, callback) {
  request({
    method: 'POST',
    url: url,
    data: JSON.stringify(data)
  }, callback);
}

function getTimetable() {
  var pattern = document.querySelector('input[name="pattern"]:checked');
  var term = document.querySelector('input[name="term"]:checked');
  var programs = document.querySelectorAll('input[name="program"]:checked') || [];
  var progs = [];
  for(var i = 0; i < programs.length; i++) {
    var el = programs[i];
    console.log(el.value);
    progs.push(el.value.toString());
  }
  var data = {
    pattern: pattern && pattern.value,
    term: term && term.value,
    programs: progs
  };

  postJSON('timetable.php', data, function(resp) {
    console.log(resp);
  });

  return false;
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
      li_input.name = "program";
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
