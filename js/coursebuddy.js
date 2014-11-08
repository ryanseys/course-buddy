var setupselect = document.getElementById('setupselect');
var progcourses = document.getElementById('progcourses');
var class_selection = document.getElementById('class_selection');
var term_selection = document.getElementById('term_selection');
var timetable = document.getElementById('timetable');
var tt;


/**
 * Build a query string.
 * querystring({ "hello": "this is a test" }) --> "hello=this%20is%20a%20test"
 * querystring({ "i": "test", nice: "it&works" }) --> "i=test&nice=it%26works"
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
        var jdata = JSON.parse(this.responseText);
        callback(jdata);
      } catch(e) {
        console.log(e, ' Could not parse as JSON: ' + this.responseText);
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
      // split into term and year (f1 --> term:f, year:1)
      term = term.value.split('');
      data.term = term[0];
      data.year = term[1];
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
    data: data,
    json: true
  }, function(resp) {
    tt = new Timetable(resp);
    tt.generateAll();
    var theHtml = tt.getHTML();
    timetable.innerHTML = theHtml;
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

function Timetable(offerings) {
  this.offerings = offerings || [];
  this.timetable = { 'M': [], 'T': [], 'W': [], 'R': [], 'F': [] };
}

Timetable.prototype._createCourseBuckets = function(offerings) {
  var courseBucket = {};
  var o = offerings || [];
  for(var i = 0; i < o.length; i++) {
    var index = o[i].course + ',' + o[i].type;
    var list = courseBucket[index] || [];
    list.push(o[i]);
    courseBucket[index] = list;
  }

  var courseBucketKeys = Object.keys(courseBucket);

  var courseBucketArray = [];
  for(var j = 0; j < courseBucketKeys.length; j++) {
    courseBucketArray.push(courseBucket[courseBucketKeys[j]]);
  }
  return courseBucketArray;
};


Timetable.prototype.doesNotConflict = function(course, otherCourses) {
  var timeStart = parseInt(course.time_start.split(':').join(''));
  var timeEnd = parseInt(course.time_end.split(':').join(''));
  var otherTimeStart, otherTimeEnd;
  for(var i = 0; i < otherCourses.length; i++) {
    otherTimeStart = parseInt(otherCourses[i].time_start.split(':').join(''));
    otherTimeEnd = parseInt(otherCourses[i].time_end.split(':').join(''));

    // course starts before other course finishes
    if(timeStart >= otherTimeStart && timeStart <= otherTimeEnd) {
      return false;
    }

    // course ends after other course starts
    if(timeEnd <= otherTimeEnd && timeEnd >= otherTimeStart) {
      return false;
    }

    // course surrounds other course
    if(timeStart <= otherTimeStart && timeEnd >= otherTimeEnd) {
      return false;
    }

    // other course surrounds course
    if(otherTimeStart <= timeStart && otherTimeEnd >= timeEnd) {
      return false;
    }
  }

  return true;
};

Timetable.prototype.getHTML = function() {
  var str = '<div>';
  var days = Object.keys(this.timetable);
  for(var i = 0; i < days.length; i++) {
    var day = days[i];
    str += '<br>' + day + '<br><ul>';
    var offers = this.timetable[day];
    for(var j = 0; j < offers.length; j++) {
      var offer = offers[j];
      str += '<li>' + offer.dept + ' ' + offer.code + ' ' + offer.type + ' ' +
          offer.time_start + ' to ' + offer.time_end + ' on ' + offer.days + '</li>';
    }
    str += '</ul>';
  }
  str += '</div>';
  return str;
};

Timetable.prototype.generateAll = function() {
  this.timetable = { 'M': [], 'T': [], 'W': [], 'R': [], 'F': [] };
  var courseBucketArray = this._createCourseBuckets(this.offerings);
  var lastUsedIndex = {};
  var finished = false;

  // all courses (cid + type)
  var courseIndex = 0;
  var courseLimit = courseBucketArray.length;

  // all offers for a course
  var offerIndex = 0;
  var offerLimit;

  while(!finished) {
    if(courseIndex === courseLimit) {
      // end of courses
      finished = true;
      break;
    }
    if(offerIndex === offerLimit) {
      // exhausted all offers from this course,
      // must try another offer from previous course
      courseIndex--;
      offerIndex = lastUsedIndex[courseIndex]++;
      break;
    }

    lastUsedIndex[courseIndex] = offerIndex;
    offerLimit = courseBucketArray[courseIndex].length;

    var offerArray = courseBucketArray[courseIndex];
    var offer = offerArray[offerIndex];
    var days = offer.days.split('');
    var conflictFound = false;

    // check if offer conflicts with anything in the
    for(var i = 0; i < days.length; i++) {
      if(!this.doesNotConflict(offer, this.timetable[days[i]])) {
        conflictFound = true;
        break;
      }
    }

    if(!conflictFound) {
      // add offer to timetable
      for(var j = 0; j < days.length; j++) {
        this.timetable[days[j]].push(offer);
      }
    } else {
      // try next offer
      offerIndex++;
      break;
    }

    courseIndex++;
    offerIndex = 0;
  }
};
