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
  if (options.urlencode)
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
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
