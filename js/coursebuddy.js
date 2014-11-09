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
  var j = !!options.json;

  console.log('requesting:', method, url);
  req.open(method, url, true);
  req.onload = function() {
    if (j) {
      var jdata;
      try {
        jdata = JSON.parse(this.responseText);
      } catch(e) {
        console.log(e, ' Could not parse as JSON: ' + this.responseText);
        jdata = [];
      }
      callback(jdata);
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
    var tts = tt.generateAll();
    timetable.innerHTML = '';
    for (var i = 0; i < tts.length; i++) {
      timetable.innerHTML += getHTML(tts[i]);
    }
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
}

Timetable.prototype._getClasses = function(offerings) {
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

function getTimes(course) {
  return {
    start: course.time_start ? parseInt(course.time_start.split(':').join('')) : +Infinity,
    end: course.time_end ? parseInt(course.time_end.split(':').join('')) : -Infinity
  };
}

Timetable.prototype.doesNotConflict = function(course, otherCourses) {
  var courseTimes = getTimes(course);
  var timeStart = courseTimes.start;
  var timeEnd = courseTimes.end;
  var courseDays = course.days ? course.days.split('') : [];
  var otherTimeStart, otherTimeEnd;

  var len = otherCourses.length;
  for(var i = 0; i < len; i++) {
    var otherCourse = otherCourses[i];
    var otherCourseTimes = getTimes(otherCourse);
    otherTimeStart = otherCourseTimes.start;
    otherTimeEnd = otherCourseTimes.end;
    otherDays = otherCourse.days ? otherCourse.days.split('') : [];

    var sameDay = false;
    for(var j = 0; j < courseDays.length; j++) {
      if(otherDays.indexOf(courseDays[j]) !== -1) {
        sameDay = true;
      }
    }

    if(!sameDay) {
      continue; // next other course
    }

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

function getHTML(tt) {
  var str = '<div><ul>';

  for(var i = 0; i < tt.length; i++) {
    var offer = tt[i];
    str += '<li>' + offer.dept + ' ' + offer.code + ' ' + offer.type + ' ' +
        offer.time_start + ' to ' + offer.time_end + ' on ' + offer.days + '</li>';
  }
  str += '</ul></div>';
  return str;
}

function initArray(length, value) {
  var arr = [], i = 0;
  arr.length = length;
  while (i < length) {
    arr[i++] = value;
  }
  return arr;
}

/**
 * Generates stupid timetable by adding all the classes based on indexes.
 * @param  {[type]} classes [description]
 * @param  {[type]} indexes [description]
 * @return {[type]}         [description]
 */
Timetable.prototype.getTimetable = function(classes, indexes) {
  var timetable = [];
  for(var i = 0; i < indexes.length; i++) {
    var classIndex = indexes[i][0];
    timetable.push(classes[i][classIndex]);
  }
  return timetable;
};

Timetable.prototype.isConflictFree = function(timetable) {
  var tt = timetable.slice(0); // copy the timetable
  var count = 0;
  var len = tt.length;
  while(count !== len) {
    var offer = tt.shift();
    if(!this.doesNotConflict(offer, tt)) {
      return false;
    }
    tt.push(offer);
    count++;
  }
  return true;
};

function increaseIndexes(indexes) {
  var newindexes = indexes.slice(0);
  var i = newindexes.length - 1;
  while(i !== -1) {
    var index = newindexes[i];
    if(index[0] >= index[1]) {
      i--;
      continue; // cannot increase this index
    }
    newindexes[i][0]++;
    break;
  }
  return newindexes;
}

Timetable.prototype.generateAll = function() {
  var ci = 0;
  var oi = 0;
  var timetables = [];
  var aTimetable = [];

  var classes = this._getClasses(this.offerings);

  var indexes = [];
  for(var i = 0; i < classes.length; i++) {
    indexes.push([0, classes[i].length-1]);
  }

  while(indexes[0][0] !== indexes[0][1]) {
    var tt = this.getTimetable(classes, indexes);

    if(this.isConflictFree(tt)) {
      timetables.push(tt);
    }

    indexes = increaseIndexes(indexes);
  }

  return timetables;
};
