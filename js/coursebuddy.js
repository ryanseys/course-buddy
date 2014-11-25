var setupselect = document.getElementById('setupselect');
var progCoreCourses = document.getElementById('progCoreCourses');
var progElectiveCourses = document.getElementById('progElectiveCourses');
var class_selection = document.getElementById('class_selection');
var term_selection = document.getElementById('term_selection');
var timetable_selection = document.getElementById('timetable_selection');
var elective_selection = document.getElementById('elective_selection');
var timetable = document.getElementById('timetable');
var enroll_button = document.getElementById('enroll_button');
var electives_div = document.getElementById('electives');
var cal = document.getElementById('calendar');
var offpattern_class_selection = document.getElementById('offpattern_class_selection');

var electivesToSelect = [];

var allTimetables = null;
var currentTimetable = null;

/**
 * Hide an element
 * @param  {object} el Element to hide.
 */
function hide(el) {
  el.style.display = 'none';
}

/**
 * Show an element
 * @param  {object} el    Element to show
 * @param  {string} style style used to show (optional)
 */
function show(el, style) {
  el.style.display = style || '';
}

/**
 * Check for electives, showing them if available.
 */
function checkForElectives() {

  timetable.innerHTML = '<br><b>Fetching electives...</b><br>';
  show(timetable_selection);
  show(timetable);
  clear_confirmation();
  putElectiveHtml();
  show(elective_selection);
}

/**
 * Get the list of programs available from the server.
 * @param  {Function} callback The callback function.
 */
function getPrograms(callback) {
  request({
    method: 'get',
    url: 'programs.php',
    json: true
  }, callback);
}

/**
 * Get the list of electives from the
 * @param  {[type]}   group_names [description]
 * @param  {[type]}   term        [description]
 * @param  {Function} callback    [description]
 * @return {[type]}               [description]
 */
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

/**
 * Get the selected program value.
 * @return {string} The selected program.
 */
function getSelectedProgram() {
  return setupselect.options[setupselect.selectedIndex].value;
}

/**
 * Get the selected term
 * @return {string} The selected term or null if no term is selected.
 */
function getSelectedTerm() {
  var term = document.querySelector('input[name="term"]:checked');
  if (term && term.value) {
    term = term.value.split('');
    return {
      year: term[1],
      term: term[0]
    };
  }
  alert('You must select a term!');
  return null;
}

/**
 * Get the list of courses from the server given a particular program id.
 * @param  {number}   program_id The program id to search for courses.
 * @param  {Function} callback   The callback function.
 */
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

/**
 * Get all the electives from the server for a particular program.
 * @param  {number}   program_id The program id
 * @param  {Function} callback   The callback function
 */
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

/**
 * Set the on-pattern UI when the user selects that option.
 */
function setOnPattern() {
  clear_confirmation();
  timetable.innerHTML = '';
  hide(class_selection);
  hide(elective_selection);
  hide(timetable_selection);
  hide(timetable);
  hide(enroll_button);
  show(term_selection);
  hide(offpattern_class_selection);
}

/**
 * Generate the timetables from all the settings that are in the UI.
 * Then update the UI to display the timetables that were found.
 */
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
  for (var j in electivesToSelect) {
    // Ensure that an elective was chosen for each group, and add to array
    var selected_elective = getSelectedElective(electivesToSelect[j]);
    if (selected_elective) {
      if (data.pattern === 'on') {
        data.chosen_electives.push(selected_elective);
      } else {
        data.courses.push(selected_elective);
      }
    }
  }

  if (pattern.value === 'off' && courseids.length === 0 && data.chosen_electives.length === 0) {
    hide(timetable);
    hide(cal);
    hide(timetable_selection);
    return;
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
      allTimetables = generateAll(resp);

      if (allTimetables.length !== 0) {
        currentTimetable = 0;
        renderCalendar(allTimetables[currentTimetable]);
        timetable.innerHTML = 'Showing timetable ' + (currentTimetable + 1) + ' of ' + allTimetables.length + ' found.';
        show(enroll_button, 'inline');
        show(cal);
        show(timetable);
        show(timetable_selection);
      } else {
        hide(cal);
        currentTimetable = null;
        var msg = '<div class="notimesmessage"><b>';
        msg += 'Sorry, there were no timetables found. ';
        msg += 'Every possibility resulted in conflicts. ';
        if (data.pattern === 'on') {
          msg += '<br>Try using the off-pattern tool for more granual control.';
        } else {
          msg += '<br>Try selecting less courses to reduce conflicts.';
        }
        msg += '</b></div>';
        timetable.innerHTML = msg;
      }
    });

  return false;
}

/**
 * Set the pattern to off-pattern when the user selects this option.
 * This updates a lot of UI.
 */
function setOffPattern() {
  function genCourseSelectionList(courses, container) {
    var course;
    container.innerHTML = '';
    var table_el = document.createElement('table');
    var table_body = document.createElement('tbody');
    table_el.className = 'coursetable';
    for (var i = 0; i < courses.length; i++) {
      course = courses[i];
      var tr = document.createElement('tr');
      var li_input = document.createElement('input');
      var label = document.createElement('label');
      li_input.value = course.id;
      li_input.type = 'checkbox';
      li_input.name = 'course';
      li_input.onchange = getNextClasses;
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      td1.appendChild(li_input);
      td2.innerHTML = ' ' + course.dept + ' ' + course.code + ' - ' + course.name;
      label.appendChild(td1);
      label.appendChild(td2);
      tr.appendChild(label);
      table_body.appendChild(tr);
    }
    table_el.appendChild(table_body);
    container.appendChild(table_el);
  }

  clear_confirmation();
  timetable.innerHTML = '';
  hide(elective_selection);
  hide(timetable_selection);
  hide(timetable);
  hide(enroll_button);
  hide(term_selection);

  getCourses(getSelectedProgram(), function(courses) {
    genCourseSelectionList(courses, progCoreCourses);
  });

  getAllElectives(getSelectedProgram(), function(courses) {
    genCourseSelectionList(courses, progElectiveCourses);
  });

  show(class_selection);
  getNextClasses();
}

/**
 * Sends the selected completed classes, and asks the server to
 * provide the next classes to take.
 * @return {[type]} [description]
 */
function getNextClasses() {
  clear_confirmation();
  var selected_classes = [];
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
      yearstanding: document.querySelector("input[name='yearstanding']:checked").value,
      program: getSelectedProgram()
    }
  }, function(result) {
      core_courses = result.next_courses.core;
      offpattern_el = document.getElementById('offpatternCoreCourseOptions');
      var table_html = "<table class='coursetable'>";

      for (i = 0; i < core_courses.length; i++) {
        var course = core_courses[i];
        var label_html = course.dept + ' ' + course.code + ' ' + course.name;
        table_html += '<tr>';
        table_html += '<td><input type="checkbox" id="' + course.id + '" name="offpatternCoreCourse" onchange="getTimetable()" value="' + course.id + '"/></td>';
        table_html += '<td><label for="' + course.id + '">' + label_html + '</label></td></tr>';
      }

      table_html += '</table>';
      offpattern_el.innerHTML = table_html;
      generateElectiveHtmlForGroups(result.next_courses.electives, true);

      show(offpattern_class_selection, 'block');
      show(elective_selection, 'block');
    });
}

/**
 * Get all the classes (buckets of offering types)
 * @param  {array} offerings Array of offerings
 * @return {array}           Array of course offering buckets
 */
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
}

/**
 * Get the times for a course
 * @param  {object} course the course to get the times
 * @return {object}        { start: start_time, end: end_time }
 */
function getTimes(course) {
  return {
    start: course.time_start ? parseInt(course.time_start.split(':').join('')) : +Infinity,
    end: course.time_end ? parseInt(course.time_end.split(':').join('')) : -Infinity
  };
}

/**
 * Checks whether two classes don't conflict with each other.
 * @param  {object} course       first course to compare
 * @param  {object} otherCourses second course to compare
 * @return {boolean}             true if the courses do not conflict, false otherwise.
 */
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

    // check if id's match to compare sections
    if (course.course === otherCourse.course) {
      var cSeq = course.seq.charAt(0);
      var otherSeq = otherCourse.seq.charAt(0);
      if (cSeq === otherSeq) {
      // do nothing, they match!
      } else if ((course.type === 'PAS' && cSeq === 'P') || (otherCourse.type === 'PAS' && otherSeq === 'P')) {
      // do nothing, PAS with P are good for any lecture section
      } else if ((course.type === 'LAB' && cSeq === 'L') || (otherCourse.type === 'LAB' && otherSeq === 'L')) {
      // do nothing, LAB with L are good for any lecture section
      } else if ((course.type === 'TUT' && cSeq === 'T') || (otherCourse.type === 'TUT' && otherSeq === 'T')) {
      // do nothing, TUT with T are good for any lecture section
      } else if (cSeq !== otherSeq) {
        return false; // the course must have the same section
      }
    }

    if (!sameDay) {
      continue; // next other course
    }

    // course starts before other course finishes
    if (timeStart >= otherTimeStart && timeStart <= otherTimeEnd) {
      return false;
    }

    // course ends after other course starts
    if (timeEnd <= otherTimeEnd && timeEnd >= otherTimeStart) {
      return false;
    }

    // course surrounds other course
    if (timeStart <= otherTimeStart && timeEnd >= otherTimeEnd) {
      return false;
    }

    // other course surrounds course
    if (otherTimeStart <= timeStart && otherTimeEnd >= timeEnd) {
      return false;
    }
  }

  return true;
}

/**
 * Create the elective list HTML and put it in the page.
 */
function putElectiveHtml() {
  // Get names of current elective group
  var current_groups = [];

  if (getSelectedTerm() === null) {
    return;
  }

  // Get the names of the elective groups for this program for this term
  getElectiveGroupNames(getSelectedProgram(), function(group_names) {
    // Using group names for this term, get the lists of possible electives for each group
    getElectives(group_names, getSelectedTerm().term, function(elective_groups) {
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
    while (electivesToSelect.indexOf(group_name) != -1) {
      group_name += '_';
    }
    electivesToSelect.push(group_name);

    electives_html += '<h3>' + elective_group.req_group + '</h3>';
    electives_html += '<select class="electiveselect"';
    if (includeAutoGenerate) {
      electives_html += ' onchange="getTimetable()"';
    }
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
    electives_div.innerHTML = '<h2>You have no electives to select for this term.</h2>';
  }
}

/**
 * Gets only the elective groups that are available for the selected term.
 * @param  {number}   program_id Program id
 * @param  {Function} callback   The callback function
 */
function getElectiveGroupNames(program_id, callback) {
  var SelectedTerm = getSelectedTerm();
  if (SelectedTerm !== null) {
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
 * @param  {Array} classes Array of classes
 * @param  {Array} indexes Array of indexes which tell us what classes to select
 * @return {object}        Potential timetable that may or may not be conflict free.
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
}

/**
 * Checks whether a timetable is conflict free, that is,
 * every course does not conflict with every other course.
 *
 * @param  {object}  timetable Timetable to check
 * @return {Boolean}           True if conflict free, false otherwise
 */
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
}

/**
 * Increase the indexes of which courses to pick from the set of
 * offering buckets.
 * @param  {Array} indexes Indexes to increase
 * @return {Array}         Increased indexes
 */
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

/**
 * Generate all possible conflict-free timetables
 * given a set of offerings.
 *
 * @param  {Array} offerings Array of offerings
 * @return {Array}           Array of conflict free timetables
 */
function generateAll(offerings) {
  var timetables = [];
  var timetableStrings = {};
  var aTimetable = [];
  var indexes = [];
  var classes = getClasses(offerings);
  if (classes.length === 0) {
    return [];
  }

  for (var i = 0; i < classes.length; i++) {
    indexes.push([0, classes[i].length]);
  }

  while (indexes[0][0] !== indexes[0][1]) {
    indexes = increaseIndexes(indexes);
    var tt = generateTimetable(classes, indexes);

    if (isConflictFree(tt)) {
      // cut out duplicates
      var ttString = JSON.stringify(tt);
      if (!timetableStrings[ttString]) {
        timetableStrings[ttString] = true;
        // add timetable to found timetables
        timetables.push(tt);
      }
    }
  }

  return timetables;
}

/**
 * Gets the selected elective for the elective group with the given name
 * @param  {string} group_name Name of elective group
 * @return {string}            elective to return
 */
function getSelectedElective(group_name) {
  var elective = document.querySelector('option[name="' + group_name + '"]:checked');

  if (elective) {
    return elective.value;
  }

  return null;
}

/**
 * Generate the calendar element (table) that can be filled
 * with a particular timetable.
 */
function generateCalendar() {
  var cal = document.getElementById('calendar');
  cal.innerHTML = '';
  var time = '08:00'; // max time is 10pm (22:00)
  var tr, td;
  var headerTitles = ['Time', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  tr = document.createElement('tr');
  tr.className = 'calendarTopRow';
  for (var i = 0; i < headerTitles.length; i++) {
    td = document.createElement('td');
    td.innerHTML = '<u><b>' + headerTitles[i] + '</b></u>';
    tr.appendChild(td);
  }
  cal.appendChild(tr);
  for (var j = 0; j < 29; j++) {
    tr = document.createElement('tr');
    td = document.createElement('td');
    td.innerHTML = time;
    tr.appendChild(td);
    for (var k = 0; k < 5; k++) {
      td = document.createElement('td');
      tr.appendChild(td);
    }
    cal.appendChild(tr);
    increaseTimeByHalfHour();
  }

  /**
   * Increase time string by a half hour.
   * Used for generating the times on the calendar times column.
   */
  function increaseTimeByHalfHour() {
    var t = time.split(':');
    var hour = parseInt(t[0]);
    var min = parseInt(t[1]);
    min += 30;
    if (min == 60) {
      min = 0;
      hour += 1;
    }
    hour = hour < 10 ? '0' + hour.toString() : hour.toString();
    min = min < 10 ? '0' + min.toString() : min.toString();
    time = [hour, min].join(':');
  }
}

/**
 * Render a calendar for the given timetable
 * @param  {object} tt Timetable to render
 */
function renderCalendar(tt) {
  generateCalendar();

  // for each offering in the timetable
  for (var i = 0; i < tt.length; i++) {
    var offer = tt[i];
    var offer_start = offer.time_start;
    var offer_end = offer.time_end;
    var days = offer.days.split('');
    var row_start = calcRowIndexForTime(offer_start);
    var row_end = calcRowIndexForTime(offer_end);

    // for every day that the offering occurs
    for (var j = 0; j < days.length; j++) {
      var day = days[j];
      var colIndex = calcColIndexForDay(day);
      cal.rows[row_start].cells[colIndex].rowSpan = (row_end - row_start) + 1;
      var shared_html = offer.dept + ' ' + offer.code + ' ' + offer.type + ' ' + offer.seq;
      cal.rows[row_start].cells[colIndex].title = (shared_html + ' ' + offer.name + ' from ' + offer_start + ' to ' + offer_end);
      cal.rows[row_start].cells[colIndex].innerHTML = (shared_html + '<br>' + offer.name);
      cal.rows[row_start].cells[colIndex].className = 'timetableCourse';

      // hide cells that are overridden by the long offer in the timetable
      for (var rowIndex = row_start + 1; rowIndex <= row_end; rowIndex++) {
        hide(cal.rows[rowIndex].cells[colIndex]);
      }
    }
  }

  /**
   * Calculate the row index given the time
   * @param  {string} time time to calculate
   * @return {number}      row index for calendar
   */
  function calcRowIndexForTime(time) {
    var t = time.split(':');
    var hour = parseInt(t[0]);
    var min = parseInt(t[1]);
    var rowIndex = Math.floor((((hour - 8) * 60) + min) / 30) + 1;
    return rowIndex;
  }

  /**
   * Calculate the col index given the day
   * @param  {string} day  day to calc
   * @return {number}      col index for calendar
   */
  function calcColIndexForDay(day) {
    return {
      M: 1,
      T: 2,
      W: 3,
      R: 4,
      F: 5
    }[day];
  }
}

/**
 * Show the next timetable in the calendar view
 * from the list of all timetables.
 */
function nextTimetable() {
  currentTimetable = (currentTimetable + 1) % allTimetables.length;
  renderCalendar(allTimetables[currentTimetable]);
  timetable.innerHTML = 'Showing timetable ' + (currentTimetable + 1) + ' of ' + allTimetables.length + ' found.';
}

/**
 * Show the previous timetable in the calendar view
 * from the list of all timetables.
 */
function prevTimetable() {
  currentTimetable -= 1;
  if (currentTimetable < 0) {
    currentTimetable = allTimetables.length - 1;
  }
  renderCalendar(allTimetables[currentTimetable]);
  timetable.innerHTML = 'Showing timetable ' + (currentTimetable + 1) + ' of ' + allTimetables.length + ' found.';
}

/**
 * When you load the page, immediately load the programs available.
 */
getPrograms(function(programs) {
  for (var i = 0; i < programs.length; i++) {
    var el = document.createElement('option');
    el.innerHTML = programs[i].name;
    el.value = programs[i].id;
    setupselect.appendChild(el);
  }
});
