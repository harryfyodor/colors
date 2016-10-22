var User = require('../models/user.js')
var Event = require('../models/event.js')
var crypto = require('crypto')
var co = require('co')

var SECRET = "ThisIsASecretString"

function authorize(req, res, next) {
  if(req.session.user) {
    next()
  } else {
    res.status(401).send({errorMsg: "Unauthorize"})
  }
}

function notAuthorize(req, res, next) {
  if(!req.sesison.user) {
    next();
  }
}

function sha256(str) {
    return crypto.createHmac('sha256', SECRET)
                .update(str)
                .digest('hex')
}

function loginUser(req, res) {

  // 如果req.session里面有user，就可以直接通过这个user找到用户直接登录就行了
  // 设置cookie里面有一个name，然后每次发送的时候如果有cookie，而且有name
  // 就把session里面的读取出来，对比cookie的name，如果相同，自动登陆
  console.log(req.body)
  console.log(req.session)
  console.log(req.cookies)

  var autoLogin = req.body.autoLogin
  var email = req.body.email
  var password = req.body.password
  var isAuto = false
  
  console.log(email, password, req.cookies.email)
  if(!email && !password && req.cookies.email && req.cookies.signedEmail) {
    // 自动登陆
    email = req.cookies.email
    isAuto = true
  } else if (email && password){
    // 不是自动登陆
    var md5 = crypto.createHash('md5')
    password = md5.update(password).digest('hex')
  } else {
    return res.send({errorMsg: "登出！"})
  }

  User.get("EMAIL", email, function(err, user) {
    if(err) {
      console.log("Login Error: ", err)
      return res.status(500).send({errorMsg:"神秘原因登陆失败..."})
    }

    // 找不到用户，直接结束
    if(!user){
      return res.send({errorMsg:"没有找到用户！"})
    }

    if(!user.activated) {
      return res.send({errorMsg:"用户未激活，请先登录邮箱。"})
    }

    // 自动登陆，不需要再进行密码验证
    if(isAuto && sha256(user.email) === req.cookies.signedEmail) {
      req.session.user = user.name
      return res.send({name:user.name})
    }

    // 普通登陆
    if(user.password !== password) {
      // 密码不正确
      return res.send({errorMsg:"密码输入错误！"})
    } else {
      // 密码正确

      // 账户密码都正确，需要如下设置
      if(req.body.autoLogin && !isAuto) {
        // 用户以后要自动登陆，需要设置cookie
        // 这里不能加secure:true，这会使得浏览器我无法添加cookie
        res.cookie('email', req.body.email, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          path:'/',
          httpOnly: false
        })

        const signedEmail = sha256(req.body.email)

        // 设置signedCookie作为验证的因子
        res.cookie('signedEmail', signedEmail, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          path:'/',
          httpOnly: false
        })
      }

      req.session.user = user.name
      return res.send({name:user.name})
    }
  })
} 

function *registerGen(req, res, newUser) {
  try {
    const userOfSameName = yield new Promise(function(resolve, reject) {
      User.get("NAME", req.body.name, function(err, user) {
        if(err) reject(err)
        resolve(user)
      })
    })
    const userOfSameEmail = yield new Promise(function(resolve, reject) {
      User.get("EMAIL", req.body.email, function(err, user) {
        if(err) reject(err)
        resolve(user)
      })
    })

    if(userOfSameName) {
      return res.status(200).send({ errorMsg: "此账户名已经被注册。"})
    } else if (userOfSameEmail) {
      return res.status(200).send({ errorMsg: "此邮箱已经被注册。"})
    }

    yield new Promise(function(resolve, reject) {
      newUser.save(function(err, user) {
        if(err) {
          console.log("Register error:" ,err)
          reject(err)
        }
        resolve(user)
      })
    })

    yield new Promise(function(resolve, reject) {
      
      const nameHash = crypto.createHmac('sha256', SECRET)
                         .update(req.body.name)
                         .digest('hex')

      const emailHash = crypto.createHmac('sha256', SECRET)
                          .update(req.body.email)
                          .digest('hex')
     
      const base = "http://localhost:3000/activate/"

      const link = `${base}${req.body.name}/${nameHash}|${emailHash}`

      User.activate({
        subject: 'Colors 验证邮件',
        html: '如果您并没有注册Colors，请忽略此邮件。点击下面链接激活账户。<br>\
                <a href=' + link + ' target="_blank">激活链接</a>',
        to: req.body.email
      }, function(err) {
        if(err) reject(err)
        res.send({ ok: true })
        resolve()
      })
    })
    
  } catch(e) {
    return res.status(500).send({ msg: "ERROR"})
    console.log('Error ', e)
  }
}

function register(req, res) {
  
  var md5 = crypto.createHash('md5'),
      password = md5.update(req.body.password).digest('hex');

  var newUser = new User({
    name: req.body.name,
    password: password,
    email: req.body.email
  })

  co(registerGen(req, res, newUser))
/*
  // 检查邮箱和名字是否有重叠
  User.get("NAME", req.body.name, function(err, user) {
    if(err) return err
    if(user) return res.status(500).send({ error: '用户名已经被注册' })
    User.get("EMAIL", req.body.email, function(err, user) {
      if(err) return err
      if(user) return res.status(500).send({ error: '邮箱已经注册过了' })
      newUser.save(function(err, user) {
        if(err) {
          console.log(err)
          return res.status(500).send({ error: '注册失败' })
        }
        req.session.user = user
        // 这里有异步，必须在
      })
      User.activate({
        subject: 'test',
        html: 'This is an email!',
        to: req.body.email
      }, function(err) {
        if(err) {
          console.log('Activate Error ', err)
          return err
        }
        newUser.save(function(err, user) {
          if(err) {
            console.log(err)
            return res.status(500).send({ error: '注册失败' })
          }
          req.session.user = user
        })
        return res.status(200).send({ msg: '注册成功，请打开邮箱激活' })
      })
    })
  })*/
}

// 点击邮箱链接激活
function activate(req, res) {

  var hash = req.body.hash
  var name = req.body.name

  // 分割加密值
  var info = hash.split("%7C")

  User.get("NAME", name, function(err, user) {
    if(err) {
      console.log('Verify Error : ', err)
      return res.json({
        errorMsg: 'wrong!'
      })
    }
    var nameHash = sha256(user.name)

    var emailHash = sha256(user.email)

    console.log(info[0] === nameHash)
    console.log(info[1] === emailHash)
    console.log(info[0])
    console.log(nameHash)
    console.log(info[1])
    console.log(emailHash)

    if(info[0] === nameHash && info[1] === emailHash) {

      User.update("ACTIVATED", name, true, function(err) {
        if(err) return err
      })
      console.log(name + " 激活成功！");
      return res.send({})
    }
    return res.json({ errorMsg: "wrong!" })
  })

}

function logout(req, res) {
  req.session.user = null
  res.clearCookie('email')
  res.clearCookie('signedEmail')
  res.send({msg:"成功登出。"})
}

function *forgetPwGen(req, res, newPw) {
  try {
    const user = yield new Promise(function(resolve, reject) {
      User.get("EMAIL", req.body.email, function(err, user) {
        if(err) {
          return res.send({errorMsg: "没有找到用户！"})
          reject(err)
        }
        resolve(user)
      })
    })

    console.log(user)

    yield new Promise(function(resolve, reject) {
      User.update('ACTIVATED', user.name, false, function(err) {
        console.log("hello")
        if(err) reject(err)
        resolve()
      })
    })

    yield new Promise(function(resolve, reject) {
      User.update('NEW_PW', user.name, newPw, function(err) {
        if(err) reject(err)
        resolve()
      })
    })

    yield new Promise(function(resolve, reject) {
      const nameHash = sha256(user.name)

      const emailHash = sha256(user.email)
       
      const base = "http://localhost:3000/activate/"

      const link = `${base}${user.name}/${nameHash}|${emailHash}`

      User.activate({
        subject: 'Colors 更换密码激活邮件',
        html: '如果您并没有更换Colors账户的密码，请忽略此邮件。点击下面链接激活新密码。<br>\
                <a href=' + link + ' target="_blank">激活链接</a>',
        to: req.body.email
      }, function(err) {
        if(err) reject(err)
        res.send({ ok: true })
        resolve()
      })
    })

  } catch(e) {
    console.log("Forget Pw Error:", e)
    return res.send({errorMsg:"Something wrong!"})
  }
}

function forgetPw(req, res) {

  // 逻辑 有email 和 新密码
  // 在数据库里面寻找到email账户 ，需要name
  // 更新密码为新的密码的hash值
  // 更新激活状态为false
  // 发送邮件

  console.log(req.body)

  var md5 = crypto.createHash('md5')
      newPw = md5.update(req.body.pw).digest('hex')
  
  co(forgetPwGen(req, res, newPw))
}

function tags(req, res) {
  var name = req.session.user
  console.log(name)
  Event.getTags(name, function(err, tags) {
    if(err) {
      console.log("Tags:", err)
      return res.send({tags:[]})
    }
    console.log(tags)
    return res.send({tags:tags})
  })
}

function begin(req, res) {
  if(req.session.counting) {
    return res.send({errorMsg:"上一次没有正确关闭！"})
  }
  req.session.counting = true
  console.log(req.session)
  tags(req, res)
}

function finish(req, res) {
  console.log("finish!!!")
  req.session.counting = false
  var newEvent = {
    name: req.session.user,
    detail: req.body.detail,
    tags: req.body.tags,
    period: req.body.period
  }
  var e = new Event(newEvent)
  e.save(function(err, evt) {
    if(err) {
      console.log("Finish Error:", err)
      return res.send({errorMsg:"Add Error"})
    }
    return res.send({ok: true})
  })
}

function cancel(req, res) {
  console.log(req)
  req.session.counting = false
  res.send({ok:true})
}

function getEvents(req, res) {
  var name = req.session.user
  Event.getSingle(name, function(err, docs){
    if(err) {
      console.log("Get events", err)
      return res.send({errorMsg:[]})
    }
    console.log(docs)
    return res.send({events:docs})
  })
}

function editEvent(req, res) {
  var pastEvent = req.body.pastEvent,
      newEvent = req.body.newEvent

  Event.update(pastEvent, newEvent, function(err) {
    console.log(err)
    if(err) {
      console.log("Edit events:", err)
      return res.send({errorMsg:"Edit failure"})
    }
    return res.send({event:{}})
  })
}

function *settingGen(newName, newPw, oldPw, name, req, res) {
  // 先update tags
  // 再update detail
  try {
    // 确认原始密码正确
    const user = yield new Promise(function(resolve, reject) {
      User.get("NAME", name, function(err, user) {
        if(err) reject(err)
        resolve(user)
      })
    })

    var md5 = crypto.createHash('md5')
    oldPw = md5.update(oldPw).digest('hex')

    if(user.password != oldPw) {
      return res.send({errorMsg:"密码输入错误！"})
    }

    yield new Promise(function(resolve, reject) {
      var md5 = crypto.createHash('md5')
      newPw = md5.update(newPw).digest('hex')
      User.update("NEW_PW", name, newPw, function(err) {
        if(err) reject(err)
        resolve()
      })
    })

    const email = user.email
    yield new Promise(function(resolve, reject) {
      User.update("NEW_NAME", email, newName, function(err) {
        if(err) reject(err)
        /*
        req.session.user = null
        res.clearCookie('email')
        res.clearCookie('signedEmail')
        res.send({msg:"请重新登录。"})
        */
        res.send({ok: true})
        resolve()
      })
    })

  } catch(e) {
    console.log("Setting error:", e)
    return res.send({errorMsg:"Setting Fail!"})
  }
}

function *setName(newName, name, req, res) {
  try {

    if(newName === name) {
      return res.send({errorMsg:"你并没有改名嘛！"}) 
    }

    const user = yield new Promise(function(resolve, reject) {
      User.get("NAME", name, function(err, user) {
        if(err) reject(err)
        resolve(user)
      })
    })

    // 检查重名
    const userOfSameName = yield new Promise(function(resolve, reject) {
      User.get("NAME", newName, function(err, user) {
        if(err) reject(err)
        resolve(user)
      })
    })

    if(userOfSameName) {
      console.log(userOfSameName, "名字已经被占用！")
      return res.send({errorMsg:"名字已经被占用！"})
    }

    // 修改名字
    const email = user.email
    yield new Promise(function(resolve, reject) {
      User.update("NEW_NAME", email, newName, function(err) {
        if(err) reject(err)
        resolve()
      })
    })

    // 修改events里面的名字
    yield new Promise(function(resolve, reject) {
      Event.changeName(name, newName, function(err) {
        if(err) reject(err)
        resolve()
      })
    })

    req.session.user = newName
    // res.clearCookie('email')
    // res.clearCookie('signedEmail')
    return res.send({msg:"设置完成。"})

  } catch(e) {
    console.log("Setting error", e)
    return res.send({errorMsg:"Setting Fail!"})
  }
}

function *setPassword(newPw, oldPw, name, req, res) {
  try {

    const user = yield new Promise(function(resolve, reject) {
      User.get("NAME", name, function(err, user) {
        if(err) reject(err)
        resolve(user)
      })
    })

    var md5 = crypto.createHash('md5')
    oldPw = md5.update(oldPw).digest('hex')

    if(user.password != oldPw) {
      return res.send({errorMsg:"密码输入错误！"})
    }

    yield new Promise(function(resolve, reject) {
      var md5 = crypto.createHash('md5')
      newPw = md5.update(newPw).digest('hex')
      User.update("NEW_PW", name, newPw, function(err) {
        if(err) reject(err)
        /*
        req.session.user = null
        res.clearCookie('email')
        res.clearCookie('signedEmail')
        return res.send({msg:"请重新登录。"})
        */
        res.send({msg:"设置完成。"})
        resolve()
      })
    })
    
  } catch(e) {
    console.log("Setting error", e)
    return res.send({errorMsg:"Setting Fail!"})
  }
}

function setting(req, res) {
  var newName = req.body.name,
      newPw = req.body.newPw,
      oldPw = req.body.oldPw,
      name = req.session.user

  console.log(newName, newPw, oldPw, name)
  // 只设置用户名
  if(newPw === "") {
    co(setName(newName, name, req, res))
  } else if(newName === "") {
    // 只设置密码
    co(setPassword(newPw, oldPw, name, req, res))
  }
}

function *rankGen() {
  try {
    const users = User.list(function(err, users) {
      if(err) reject(err)
      resolve()
    })
  } catch(e) {
    console.log("Rank List:", e)
    return res.send({errorMsg:"获取排行榜失败..."})
  }
}

function rank(req, res) {
  /*
  User.list(function(err, users) {
    if(err) {
      console.log("Rank error:",err)
      return res.send({errorMsg:"No user"})
    }
    res.send({users:users})
  })*/
  Event.getRank(function(err, docs) {
    if(err) {
      console.log("Rank Error:", err)
      return res.send({errorMsg:"Fail to get ranking!"})
    }
    return res.send({list: docs})
  })
}

function degree(req, res) {
  var name = req.session.user
  Event.getPeriod(name, function(err, period) {
    if(err) {
      console.log("Degree", error)
      return res.send({errorMsg:"错误！"})
    }
    console.log(period);
    return res.send({degree:period})
  })
}

module.exports = {
  loginUser: loginUser,
  register: register,
  activate: activate,
  logout: logout,
  forgetPw: forgetPw,
  tags: tags,
  begin: begin,
  finish: finish,
  cancel: cancel,
  getEvents: getEvents,
  editEvent: editEvent,
  setting: setting,
  rank: rank,
  degree: degree,
  authorize: authorize
}
