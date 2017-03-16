var records = [
    { id: 1, username: 'amin', password: 'java', displayName: 'Amin', emails: [ { value: 'hupeldepup@voorbeeld.com' } ] }
];

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
