var mongodb = require('./db')
var crypto = require('crypto')

function Event(e) {
  this.name = e.name
  this.detail = e.detail
  this.period = e.period
  this.tags = e.tags
}

Event.prototype.save = function(callback) {
  var today = new Date(),
      date = today.getFullYear() 
         + "-"
         + ((today.getMonth() + 1) >= 10 ? (today.getMonth() + 1) : "0" + (today.getMonth() + 1))
         + "-" 
         + (today.getDate() >= 10 ? today.getDate() : "0" + today.getDate())
      time = today.getHours() + ":" + (today.getMinutes() > 10 ? today.getMinutes() : "0" + today.getMinutes())

  var event = {
    name: this.name,
    detail: this.detail,
    tags: this.tags,
    period: this.period,
    date: date,
    time: time
  }
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('events', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.insert(event, {
        safe: true
      }, function(err, event) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        callback(null, event[0])
      })
    })
  })
}

Event.getSingle = function(name, callback) {
  console.log(name);
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('events', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.find({
        "name": name
      }).sort({
        time: -1
      }).toArray(function(err, docs) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        console.log(docs)
        callback(null, docs)
      })
    })
  })
}

Event.update = function(pastEvent, newEvent, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('events', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.update({
        "time": pastEvent.time,
        "date": pastEvent.date
      }, {
        $set: {
          tags: newEvent.tags,
          detail: newEvent.detail
        }
      }, function(err) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        return callback(null)
      })
    })
  })
}

Event.getTags = function(name, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('events', function(err, collection) {
      if(err) {
        console.log("Get tags error:", err)
        return callback(err)
      }
      collection.distinct("tags", {
        name:name
      }, function(err, docs) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        callback(null, docs)
      })
    })
  })
}

Event.getPeriod = function(name, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('events', function(err, collection) {
      if(err) {
        mongodb.close()
        console.log("Get period error:", err)
        return callback(err)
      }
      collection.find({
        "name":name
      }).toArray(function(err, docs) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        var period = 0
        for (var i = 0; i < docs.length; i++) {
          period += docs[i].period
        }
        callback(null, period)
      })
    })
  })
}

Event.changeName = function(name, newName, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('events', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.update({
        "name": name
      }, {
        $set: {
          name: newName
        }
      },{
        multi: true 
      }, function(err) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        return callback(null)
      })
    })
  })
}

Event.getRank = function(callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection("events", function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.aggregate(
        [
        {$group: { _id: "$name", total: {$sum:"$period"} } }
      ]).sort({
        total: 1
      }).toArray(function(err, docs) {
        mongodb.close()
        if(err) console.log(err)
        console.log(docs)
        return callback(null, docs)
      })
    })
  })
}

module.exports = Event