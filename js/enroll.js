var form_enroll = document.getElementById("form_enroll");
var results_div = document.getElementById("results");
var electives_form = document.getElementById("form_electives");

function enroll(){
  // Get offerings ids of core courses from selected timetable
  var offering_ids = form_enroll.enroll_in.value;
  if (offering_ids){
    offering_ids = JSON.parse(offering_ids);
  } else {
    alert("You have not selected a timetable");
    return false;
  }

  // Request Enrolment
  request({
    method: 'post',
    url: 'enroll.php',
    json: true,
    urlencode: true,
    data: {enroll_in: JSON.stringify(offering_ids)}
  }, function(results){
    for (var i in results){
      var result = JSON.parse(results[i]);
      results_div.innerHTML += '<li>' + (result.success ? 'Enrolled': 'Not Enrolled') + ': ' + result.dept + ' ' + result.code + ': ' + result.name + ' ' + result.seq + '</li>';
    }
  });
}

/* Gets the selected elective for the elective group with the given name */
function _getSelectedElective(group_name){
  var elective_inputs = electives_form[group_name];
  for (var i in elective_inputs){
    var input = elective_inputs[i];
    if (input.checked){
      return input.value;
    }
  }
  return null;
}
