var setupselect = document.getElementById('setupselect');
var progcourses = document.getElementById('progcourses');
var class_selection = document.getElementById('class_selection');
var term_selection = document.getElementById('term_selection');

/**
 * Build a query string.
 * querystring({ "hello": "this is a test" }) --> "?hello=this%20is%20a%20test"
 * querystring({ "i": "test", nice: "it&works" }) --> "?i=test&nice=it%26works"
 *
 * @param  {object} obj key value pair for building querystring.
 * @return {[type]}     the built query string or empty string.
 */
function querystring(obj) {
  obj = obj || {};
  var str = '';
  var keys = Object.keys(obj);
  for(var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = obj[key];
    if (value) {
      str += key + '=' + encodeURIComponent(value) + '&';
    }
  }

  return str.slice(0, -1);
}

function request(options, callback) {
  options = options || {};
  var req = new XMLHttpRequest();
  var data = options.data || {};
  var qs = querystring(data);
  var method = options.method.toLowerCase();
  var url = method === 'get' ? options.url + '?' + qs : options.url;
  var json = !!options.json;

  console.log('requesting:', method, url);
  req.open(method, url, true);
  req.onload = function() {
    if (json) {
      try {
        callback(JSON.parse(this.responseText));
      } catch(e) {
        console.log('Could not parse as JSON: ' + this.responseText);
        callback([]);
      }
    } else {
      callback(this.responseText);
    }
  };

  if(method === 'post') {
    req.send(qs);
  } else {
    req.send();
  }
}

function get_programs(callback) {
  request({
    method: 'get',
    url: 'programs.php',
    json: true
  }, callback);
}

function get_selected_program() {
  return setupselect.options[setupselect.selectedIndex].value;
}

function get_courses(program_id, callback) {
  var data = { program: program_id };
  var url = 'courses.php';

  request({
    method: 'get',
    url: url,
    data: data,
    json: true
  }, callback);
}

function setOnPattern() {
  class_selection.style.display = 'none';
  term_selection.style.display = '';
}

function getTimetable() {
  var program = get_selected_program();
  var pattern = document.querySelector('input[name="pattern"]:checked');
  var term = document.querySelector('input[name="term"]:checked');
  var courses = document.querySelectorAll('input[name="course"]:checked') || [];
  var courseids = [];
  for(var i = 0; i < courses.length; i++) {
    var el = courses[i];
    courseids.push(el.value.toString());
  }



  var data = {};

  if(pattern && pattern.value) {
    data.pattern = pattern.value;
  }

  if(program) {
    data.program = program;
  }

  if(data.pattern === 'on') {
    if(term && term.value) {
      data.term = term.value;
    } else {
      alert('You must select a term!');
      return false;
    }
  } else if(data.pattern === 'off') {
    data.courses = courseids || [];
  } else {
    alert('You must select on or off pattern!');
    return false;
  }

  request({
    method: 'get',
    url: 'timetable.php',
    data: data
  }, function(resp) {
    console.log(resp);
  });

  return false;
}

function setOffPattern() {
  term_selection.style.display = 'none';
  get_courses(get_selected_program(), function(courses) {
    var course;
    progcourses.innerHTML = '';
    for (var i = 0; i < courses.length; i++) {
      course = courses[i];
      var li = document.createElement('li');
      var li_input = document.createElement('input');
      li_input.value = course.id;
      li_input.type = 'checkbox';
      li_input.name = 'course';
      li.appendChild(li_input);
      li.innerHTML += ' ' + course.dept + ' ' + course.code + ' - ' + course.name;
      progcourses.appendChild(li);
    }
    class_selection.style.display = '';
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
