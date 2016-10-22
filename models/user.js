var mongodb = require('./db')
var crypto = require('crypto')
var nodemailer = require('nodemailer')

var NAME = "NAME"
var EMAIL = "EMAIL"

var ACTIVATED = "ACTIVATED"
var FIRST = "FIRST"
var NEW_NAME = "NEW_NAME"
var NEW_PW = "NEW_PW"
var ADD_PERIOD = "ADD_PERIOD"

// 用 nodemailer 发送邮件
function sendEmail(detail, callback) {
  var config_email = {
    host: 'smtp.163.com',
    post: '25',
    auth: {
      user: 'harryfyodor@163.com',
      pass: 'jn512ma3fz'
    }
  }

  var transporter = nodemailer.createTransport(config_email)
  var data = {
    from: config_email.auth.user,
    to: detail.to,
    subject: detail.subject,
    html: detail.html
  }

  transporter.sendMail(data, function(err, info) {
    if(err) {
      console.log("SendEmail Error", err)
      callback(err)
    } else {
      console.log("Message sent:" + info.response)
      callback(null);
    }
  })
}

function User(user) {
  this.name = user.name
  this.email = user.email
  this.password = user.password
}

User.prototype.save = function(callback) {
  var user = {
    name: this.name,
    password: this.password,
    email: this.email,
    activated: false,
    period: 0 // 0 ~ 250
  }
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    // 读取 users
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.insert(user, {
        safe: true
      }, function(err, user) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        callback(null, user[0])
      })
    })
  })
}

// 发送邮件，激活用户，注册
User.activate = function(detail, callback) {
  sendEmail(detail, callback)
}

// 用户设置，更改密码, 用户名, 等级，新用户与否
User.update = function(type, searchKey, newItem, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    // 把users读取出来
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err)
      }

      if(type === FIRST) {
        // 新用户
        collection.update({
          "name": searchKey
        }, {
          $set: {isNew: false}
        }, function(err) {
          mongodb.close()
          if(err) return callback(err)
          return callback(null)
        })
      } else if (type === ACTIVATED) {
        collection.update({
          "name": searchKey
        }, {
          $set: {activated: newItem}
        }, function(err) {
          console.log("ac")
          mongodb.close()
          if(err) return callback(err)
          return callback(null)
        })
      } else if (type === ADD_PERIOD) {
          collection.update({
            "name": searchKey
          }, {
            $inc: {"period":newItem}
          }, function(err) {
            mongodb.close()
            if(err) return callback(err)
            return callback(null)
          })
      } else if (type === NEW_PW) {
        collection.update({
          "name": searchKey
        }, {
          $set: {password: newItem}
        }, function(err) {
          mongodb.close()
          if(err) return callback(err)
          return callback(null)
        })
      } else if (type === NEW_NAME) {
        collection.update({
          "email": searchKey
        }, {
          $set: {name: newItem}
        }, function(err) {
          mongodb.close()
          if(err) return callback(err)
          return callback(null)
        })
      } else {
        console.log("Update Error")
      }
    })
  })
}

// 忘记密码，发送邮件到email
User.changePw = function() {

}

User.verify = function(name, hash, callback) {
  this.get("NAME", name, function() {

  })
}

// 通过email找到user，用于登录
User.get = function(type, item, callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    // 把user读取出来
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close();
        return callback(err)
      }
      // 通过email来查找
      if(type === EMAIL) {
        collection.findOne({
          email: item
        }, function(err, user) {
          mongodb.close();
          if(err) return callback(err)
          return callback(null, user)
        })
      } else if (type === NAME) {
      // 通过name来查找
        collection.findOne({
          name: item
        }, function(err, user) {
          mongodb.close();
          if(err) return callback(err)
          return callback(null, user)
        })
      }
    })
  })
}

User.list = function(callback) {
  mongodb.open(function(err, db) {
    if(err) {
      return callback(err)
    }
    db.collection('users', function(err, collection) {
      if(err) {
        mongodb.close()
        return callback(err)
      }
      collection.find({}, {
        "name": 1,
        "degree": 1
      }).sort({
        degree: 1
      }).toArray(function(err, docs) {
        mongodb.close()
        if(err) {
          return callback(err)
        }
        callback(null, docs)
      })
    })
  })
}

module.exports = User