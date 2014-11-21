var setupselect = document.getElementById('setupselect');
var progCoreCourses = document.getElementById('progCoreCourses');
var progElectiveCourses = document.getElementById('progElectiveCourses');
var class_selection = document.getElementById('class_selection');
var term_selection = document.getElementById('term_selection');
var timetable_selection = document.getElementById('timetable_selection');
var elective_selection = document.getElementById('elective_selection');
var timetable = document.getElementById('timetable');
var enroll_button = document.getElementById("enroll_button");
var electives_div = document.getElementById("electives");
var electives_form = document.getElementById("form_electives");
var tt;

var electivesToSelect = [];

function checkForElectives() {
  clear_confirmation();
  putElectiveHtml();
  elective_selection.style.display = '';
}

function selected_term() {
  elective_selection.style.display = 'none';
  timetable_selection.style.display = 'none';
  timetable.style.display = 'none';
  enroll_button.style.display = 'none';
}

function getPrograms(callback) {
  request({
    method: 'get',
    url: 'programs.php',
    json: true
  }, callback);
}

function getElectives(group_names, term, callback) {
  request({
    method: 'get',
    url: 'electives.php',
    json: true,
    urlencode: true,
    data: {
      groups: JSON.stringify(group_names),
      term: term
    }
  }, callback);
}

function getSelectedProgram() {
  return setupselect.options[setupselect.selectedIndex].value;
}

function getSelectedTerm() {
  var term = document.querySelector('input[name="term"]:checked');
  if (term && term.value) {
    term = term.value.split('');
    return {
      "year": term[1],
      "term": term[0]
    };
  }
  alert('You must select a term!');
  return null;
}

function getCourses(program_id, callback) {
  var data = {
    program: program_id
  };
  var url = 'courses.php';

  request({
    method: 'get',
    url: url,
    data: data,
    json: true
  }, callback);
}

function getAllElectives(program_id, callback) {
  request({
    method: 'get',
    url: 'electives.php',
    data: {
      program: program_id,
      all: true
    },
    json: true
  }, callback);
}

function setOnPattern() {
  clear_confirmation();
  timetable.innerHTML = '';
  class_selection.style.display = 'none';
  elective_selection.style.display = 'none';
  timetable_selection.style.display = 'none';
  timetable.style.display = 'none';
  enroll_button.style.display = "none";
  term_selection.style.display = '';
  document.getElementById("offpattern_generate").style.display = 'none';
  document.getElementById("offpattern_class_selection").style.display = 'none';
}

function getTimetable() {
  clear_confirmation();
  timetable.innerHTML = '<br><b>Generating timetables...</b><br>';
  var program = getSelectedProgram();
  var pattern = document.querySelector('input[name="pattern"]:checked');
  var term = document.querySelector(pattern.value === 'on' ? 'input[name="term"]:checked' : 'input[name="offpattern_term"]:checked');
  var courses = document.querySelectorAll(pattern.value === 'on' ? 'input[name="course"]:checked' : 'input[name="offpatternCoreCourse"]:checked') || [];
  var courseids = [];
  for (var i = 0; i < courses.length; i++) {
    var el = courses[i];
    courseids.push(el.value.toString());
  }

  var data = {};

  if (pattern && pattern.value) {
    data.pattern = pattern.value;
  }

  if (program) {
    data.program = program;
  }

  if (data.pattern === 'on') {
    if (term && term.value) {
      // split into term and year (f1 --> term:f, year:1)
      term = term.value.split('');
      data.term = term[0];
      data.year = term[1];
    } else {
      alert('You must select a term!');
      return false;
    }
  } else if (data.pattern === 'off') {
    data.term = term.value;
    data.courses = courseids;
  } else {
    alert('You must select on or off pattern!');
    return false;
  }

  data.chosen_electives = [];
  for (var i in electivesToSelect) {
    // Ensure that an elective was chosen for each group, and add to array
    var selected_elective = getSelectedElective(electivesToSelect[i]);
    if (selected_elective) {
      if (data.pattern === 'on') {
        data.chosen_electives.push(selected_elective);
      } else {
        data.courses.push(selected_elective);
      }
    }
  }

  if (!data.chosen_electives.length) {
    delete data.chosen_electives;
  }

  request({
    method: 'get',
    url: 'timetable.php',
    data: data,
    json: true
  }, function(resp) {
    var tts = generateAll(resp);

    timetable.innerHTML = (tts.length === 0 ? '<br><b>There were no timetables found.</b><br>' : '');

    for (var i = 0; i < tts.length; i++) {
      timetable.innerHTML += getTimetableHTML(tts[i]);
    }

    enroll_button.style.display = (tts.length === 0 ? 'none' : 'inline');
    timetable.style.display = '';
    timetable_selection.style.display = '';
  });

  return false;
}

function setOffPattern() {
  function genCourseSelectionList(courses, container) {
    var course;
    container.innerHTML = '';
    for (var i = 0; i < courses.length; i++) {
      course = courses[i];
      var li = document.createElement('li');
      var li_input = document.createElement('input');
      var label = document.createElement('label');
      li_input.value = course.id;
      li_input.type = 'checkbox';
      li_input.name = 'course';
      label.appendChild(li_input);
      label.innerHTML += ' ' + course.dept + ' ' + course.code + ' - ' + course.name;
      li.appendChild(label);
      container.appendChild(li);
    }
  }

  clear_confirmation();
  timetable.innerHTML = '';
  elective_selection.style.display = 'none';
  timetable_selection.style.display = 'none';
  timetable.style.display = 'none';
  enroll_button.style.display = "none";
  term_selection.style.display = 'none';
  getCourses(getSelectedProgram(), function(courses) {
    genCourseSelectionList(courses, progCoreCourses)
  });
  getAllElectives(getSelectedProgram(), function(courses) {
    genCourseSelectionList(courses, progElectiveCourses)
  });

  class_selection.style.display = '';
}

// Sends the selected completed classes, and asks the server to provide the next 5 classes to take.
function getNextClasses() {
  clear_confirmation();
  selected_classes = [];
  selected_class_inputs = document.querySelectorAll("input[name='course']:checked");
  for (i = 0; i < selected_class_inputs.length; i++) {
    selected_classes.push(selected_class_inputs[i].value);
  }

  request({
    url: 'offpattern.php',
    method: 'post',
    urlencode: true,
    json: true,
    data: {
      courses: selected_classes,
      term: document.querySelector("input[name='offpattern_term']:checked").value,
      program: getSelectedProgram()
    }
  }, function(result) {
    core_courses = result.next_courses.core
    ul = document.getElementById("offpatternCoreCourseOptions");
    ul.innerHTML = "";
    for (i = 0; i < core_courses.length; i++) {
      label = core_courses[i].dept + " " + core_courses[i].code + " " + core_courses[i].name;
      ul.innerHTML += "<li><label><input type='checkbox' name='offpatternCoreCourse' value='"+core_courses[i].id+"'/>" + label + "</label></li>";
    }

    generateElectiveHtmlForGroups(result.next_courses.electives, false);

    document.getElementById("offpattern_class_selection").style.display = "block";
    document.getElementById("elective_selection").style.display = "block";
    document.getElementById("offpattern_generate").style.display = 'inline';
  });
}

getPrograms(function(programs) {
  for (var i = 0; i < programs.length; i++) {
    var el = document.createElement('option');
    el.innerHTML = programs[i].name;
    el.value = programs[i].id;
    setupselect.appendChild(el);
  }
});

function getClasses(offerings) {
  var courseBucket = {};
  var o = offerings || [];
  for (var i = 0; i < o.length; i++) {
    var index = o[i].course + ',' + o[i].type;
    var list = courseBucket[index] || [];
    list.push(o[i]);
    courseBucket[index] = list;
  }

  var courseBucketKeys = Object.keys(courseBucket);

  var courseBucketArray = [];
  for (var j = 0; j < courseBucketKeys.length; j++) {
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

function doesNotConflict(course, otherCourses) {
  var courseTimes = getTimes(course);
  var timeStart = courseTimes.start;
  var timeEnd = courseTimes.end;
  var courseDays = course.days ? course.days.split('') : [];
  var otherTimeStart, otherTimeEnd;

  var len = otherCourses.length;
  for (var i = 0; i < len; i++) {
    var otherCourse = otherCourses[i];
    var otherCourseTimes = getTimes(otherCourse);
    otherTimeStart = otherCourseTimes.start;
    otherTimeEnd = otherCourseTimes.end;
    otherDays = otherCourse.days ? otherCourse.days.split('') : [];

    var sameDay = false;
    for (var j = 0; j < courseDays.length; j++) {
      if (otherDays.indexOf(courseDays[j]) !== -1) {
        sameDay = true;
      }
    }

    if (!sameDay) {
      continue; // next other course
    }

    // course starts before other course finishes
    if (timeStart >= otherTimeStart && timeStart <= otherTimeEnd) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }

    // course ends after other course starts
    if (timeEnd <= otherTimeEnd && timeEnd >= otherTimeStart) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }

    // course surrounds other course
    if (timeStart <= otherTimeStart && timeEnd >= otherTimeEnd) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }

    // other course surrounds course
    if (otherTimeStart <= timeStart && otherTimeEnd >= timeEnd) {
      // console.log('Conflict found: ', course, otherCourse);
      return false;
    }
  }

  return true;
};

function getTimetableHTML(tt) {

  // Get json array of offering ids
  var offering_ids = [];
  for (var i in tt) {
    offering_ids.push(tt[i].id);
  }
  offering_ids = JSON.stringify(offering_ids);

  var str = '<div><label><input type="radio" name="enroll_in" value=' + offering_ids + '></input>Select this Timetable</label><ul>';

  for (var i = 0; i < tt.length; i++) {
    var offer = tt[i];
    str += '<li>' + offer.dept + ' ' + offer.code + ' ' + offer.type + ' ' + offer.seq + ' ' +
    offer.time_start + ' to ' + offer.time_end + ' on ' + offer.days + '</li>';
  }
  str += '</ul></div>';
  return str;
}

function putElectiveHtml() {
  // Get names of current elective group
  var current_groups = [];

  if (getSelectedTerm() === null) { return; }

  // Get the names of the elective groups for this program for this term
  getElectiveGroupNames(getSelectedProgram(), function(group_names) {

    // Using group names for this term, get the lists of possible electives for each group
    getElectives(group_names, getSelectedTerm()["term"], function(elective_groups) {
      generateElectiveHtmlForGroups(elective_groups, true);
      getTimetable();
    });
  });
}

function generateElectiveHtmlForGroups(elective_groups, includeAutoGenerate) {
  var electives_html = '';
  electivesToSelect = [];

  // For each elective group, build course selection HTML
  for (var i in elective_groups) {
    var elective_group = elective_groups[i];
    var electives = elective_group.electives;
    var group_name = elective_group.req_group;
    while (electivesToSelect.indexOf(group_name) != -1)
      group_name += "_";
    electivesToSelect.push(group_name);

    electives_html += '<h3>' + elective_group.req_group + '</h3>';
    electives_html += '<select class="electiveselect"';
    if (includeAutoGenerate)
      electives_html += ' onchange="getTimetable()"';
    electives_html += '><option value="">No elective</option>';

    // For each elective in this group, add its option to HTML
    for (var j in electives) {
      var elective = electives[j];
      electives_html += '<option name="' + group_name + '" value="' + elective.id + '"/>' +
      elective.dept + ' ' + elective.code + ': ' + elective.name + '</option>';
    }

    electives_html += '</select>';
  }

  // Add Elective Selector HTML to DOM
  if (electives_html) {
    electives_div.innerHTML = '<h2>Select your electives</h2>' + electives_html;
  } else {
    electives_div.innerHTML = "<h2>You have no electives to select for this term.</h2>";
  }
}

/* Gets only the elective groups that are available for the selected term. */
function getElectiveGroupNames(program_id, callback) {
  var SelectedTerm = getSelectedTerm();
  if (SelectedTerm != null) {
    request({
      method: 'get',
      url: 'electives.php',
      json: true,
      data: {
        program: program_id
      }
    }, function(elective_groups) {
        // Get group names for current term
        var group_names = [];
        for (var i in elective_groups) {
          var group = elective_groups[i];
          if (group.year.toLowerCase() === SelectedTerm.year && group.term.toLowerCase() === SelectedTerm.term) {
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
function generateTimetable(classes, indexes) {
  var timetable = [];
  for (var i = 0; i < indexes.length; i++) {
    var classIndex = indexes[i][0] - 1;
    classIndex = classIndex === -1 ? 0 : classIndex;
    var offer = classes[i][classIndex];
    timetable.push(offer);
  }
  return timetable;
};

function isConflictFree(timetable) {
  var tt = timetable.slice(0); // copy the timetable
  var count = 0;
  var len = tt.length;
  while (count !== len) {
    var offer = tt.shift();
    if (!doesNotConflict(offer, tt)) {
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
  while (i !== -1) {
    if (newindexes[i][0] < newindexes[i][1]) {
      newindexes[i][0]++;
      break;
    } else {
      i--;
    }
  }
  return newindexes;
}

function generateAll(offerings) {
  var timetables = [];
  var aTimetable = [];
  var indexes = [];
  var classes = getClasses(offerings);
  if (classes.length == 0) { return []; }

  for (var i = 0; i < classes.length; i++) {
    indexes.push([0, classes[i].length]);
  }

  while (indexes[0][0] !== indexes[0][1]) {
    indexes = increaseIndexes(indexes);
    var tt = generateTimetable(classes, indexes);

    if (isConflictFree(tt)) {
      timetables.push(tt);
    }
  }

  return timetables;
};

/* Gets the selected elective for the elective group with the given name */
function getSelectedElective(group_name) {
  var elective = document.querySelector('option[name="' + group_name + '"]:checked');

  if (elective) {
    return elective.value;
  }

  return null;
}
