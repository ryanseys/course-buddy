var form_enroll = document.getElementById("form_enroll");
var results_div = document.getElementById("results");

function enroll(){
  clear_confirmation();

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

function clear_confirmation(){
  results_div.innerHTML = "";
}
