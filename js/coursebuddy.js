var setupselect = document.getElementById('setupselect');
var progcourses = document.getElementById('progcourses');
var class_selection = document.getElementById('class_selection');
var term_selection = document.getElementById('term_selection');
var timetable = document.getElementById('timetable');
var enroll_button = document.getElementById("enroll_button");
var electives_div = document.getElementById("electives");
var tt;


function get_programs(callback) {
  request({
    method: 'get',
    url: 'programs.php',
    json: true
  }, callback);
}

function _get_electives(group_names, callback){
  request({
    method: 'get',
    url: 'electives.php',
    json: true,
    urlencode: true,
    data: {groups: JSON.stringify(group_names)}
  }, callback);
}

function get_selected_program() {
  return setupselect.options[setupselect.selectedIndex].value;
}

function get_selected_term(){
  var term = document.querySelector('input[name="term"]:checked');
  if(term && term.value) {
    term = term.value.split('');
    return {"year": term[1], "term": term[0]};
  }
  alert('You must select a term!');
  return null;
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
  timetable.innerHTML = '';
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
    timetable.innerHTML = '<br><b>Generating timetables...</b><br>';
    tt = new Timetable(resp);
    var tts = tt.generateAll();

    if(tts.length === 0) {
      timetable.innerHTML = '<br><b>There were no timetables found.</b><br>';
    } else {
      timetable.innerHTML = '';
    }

    for (var i = 0; i < tts.length; i++) {
      timetable.innerHTML += getTimetableHTML(tts[i]);
    }
  });

  // Reveal timetable selector form
  enroll_button.style.display = "inline";

  // Write Electives HTML
  putElectiveHtml();

  return false;
}

function setOffPattern() {
  timetable.innerHTML = '';
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
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }

    // course ends after other course starts
    if(timeEnd <= otherTimeEnd && timeEnd >= otherTimeStart) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }

    // course surrounds other course
    if(timeStart <= otherTimeStart && timeEnd >= otherTimeEnd) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }

    // other course surrounds course
    if(otherTimeStart <= timeStart && otherTimeEnd >= timeEnd) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }
  }

  return true;
};

function getTimetableHTML(tt) {

  // Get json array of offering ids
  var offering_ids = [];
  for (var i in tt){
    offering_ids.push(tt[i].id);
  }
  offering_ids = JSON.stringify(offering_ids);

  var str = '<div><input type="radio" name="enroll_in" value=' + offering_ids + '></input>Select this Timetable<ul>';

  for(var i = 0; i < tt.length; i++) {
    var offer = tt[i];
    str += '<li>' + offer.dept + ' ' + offer.code + ' ' + offer.type + ' ' + offer.seq + ' ' +
        offer.time_start + ' to ' + offer.time_end + ' on ' + offer.days + '</li>';
  }
  str += '</ul></div>';
  return str;
}

function putElectiveHtml(){
  // Get names of current elective group
  var current_groups = [];

  var SelectedTerm = get_selected_term();
  if (SelectedTerm === null){
    return;
  }

  // Get the names of the elective groups for this program for this term
  _get_current_elective_group_names(get_selected_program(), function(group_names){

    // Using group names for this term, get the lists of possible electives for each group
    _get_electives(group_names, function(elective_groups) {
      var electives_html = '';

      // For Each Elective Group, build course selection HTML
      for (var i in elective_groups){
        var elective_group = elective_groups[i];
        var electives = elective_group.electives;

        electives_html += '<h3>' + elective_group.req_group + '</h3>';

        // For each elective in this group, add its option to HTML
        for (var j in electives){
          var elective = electives[j];
          electives_html += '<input type="radio" name="' + elective_group.req_group + '" value="' + elective.id + '"/>';
          electives_html += elective.dept + ' ' + elective.code + ': ' + elective.name + '</div>';
          electives_html += '<br/>';
        }
      }

      // Add Elective Selector HTML to DOM
      if (electives_html){
        electives_div.innerHTML = '<h2>Select your Electives</h2>' + electives_html;
      }
    });
  });
}

/* Gets only the elective groups that are available for the selected term. */
function _get_current_elective_group_names(program_id, callback){
  var SelectedTerm = get_selected_term();
  if (SelectedTerm != null){
    request({
      method: 'get',
      url: 'electives.php',
      json: true,
      data: {program: program_id}
    }, function(elective_groups){

      // Get group names for current term
      var group_names = [];
      for(var i in elective_groups){
        var group = elective_groups[i];
        if (group.year.toLowerCase() === SelectedTerm.year && group.term.toLowerCase() === SelectedTerm.term){
          group_names.push(group.req_group);
        }
      }

      // Send group names to callback function
      callback(group_names);
    });
  }
}

/**
 * Generates potential timetable by adding all the classes based on indexes.
 */
Timetable.prototype.getTimetable = function(classes, indexes) {
  var timetable = [];
  for(var i = 0; i < indexes.length; i++) {
    var classIndex = indexes[i][0] - 1;
    classIndex = classIndex === -1 ? 0 : classIndex;
    var offer = classes[i][classIndex];
    timetable.push(offer);
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
    if(newindexes[i][0] < newindexes[i][1]) {
      newindexes[i][0]++;
      break;
    } else {
      i--;
    }
  }
  return newindexes;
}

Timetable.prototype.generateAll = function() {
  var timetables = [];
  var aTimetable = [];
  var indexes = [];
  var classes = this._getClasses(this.offerings);

  for(var i = 0; i < classes.length; i++) {
    indexes.push([0, classes[i].length]);
  }

  while(indexes[0][0] !== indexes[0][1]) {
    indexes = increaseIndexes(indexes);
    var tt = this.getTimetable(classes, indexes);

    if(this.isConflictFree(tt)) {
      timetables.push(tt);
    }
  }

  return timetables;
};
