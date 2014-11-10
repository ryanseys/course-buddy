var form_enroll = document.getElementById("form_enroll");
var results_div = document.getElementById("results");

function enroll(){
  // Get offerings ids of core courses from selected timetable
  var offering_ids = form_enroll.enroll_in.value;
  if (offering_ids){
    offering_ids = JSON.parse(offering_ids);
  } else {
    alert("You have not selected a timetable");
    return false;
  }

  // get offering ids of selected elective sources
  var current_groups = getCurrentElectiveGroups();
  for (var i in current_groups){
    var group = current_groups[i];

    var selected_elective = _getSelectedElective(group.req_group);
    if (selected_elective){
      offering_ids.push(selected_elective);
    } else {
      alert("You have not selected an elective");
      return false;
    }
  }

  // Request Enrollment
  console.log("about to enroll in", offering_ids);
  var req = new XMLHttpRequest();
  console.log('synchronous requesting:', 'POST', 'enroll.php');
  req.open('POST', 'enroll.php', false);
  req.send(JSON.stringify(offering_ids));

  //console.log(req.responseText);

  // Write Enrollment Results to HTML
  var response = JSON.parse(req.responseText);
  var results_html = '<h2>Enrollment Results</h2><ul>';
  for (var i in response){
    var result = JSON.parse(response[i]);
    console.log(result);
    results_html += '<li>' + (result.success ? 'Enrolled': 'Not Enrolled') + ': ' + result.dept + ' ' + result.code + ': ' + result.name + ' ' + result.seq + '</li>';
  }
  results_div.innerHTML = results_html + '</ul>';
}

/* Gets the selected elective for the elective group with the given name */
function _getSelectedElective(group_name){
  var elective_inputs = form_enroll[group_name];
  for (var i in elective_inputs){
    var input = elective_inputs[i];
    if (input.checked){
      return input.value;
    }
  }
  return null;
}
