var express = require('express')
var oracledb = require('oracledb');
var mybatisMapper = require('mybatis-mapper')
var dbConfig = require('../config/dbConfig')
mybatisMapper.createMapper([ './SQL/check.xml' ])
oracledb.autoCommit = true;

var router = express.Router()

function Update_data(result) {
  var column = [];
  var row = {};
  var data = [];
  for (let i of result.metaData) {
    column.push(i['name']);
  }
  for (let i = 0; i < result.rows.length; i++) {
    for (let j = 0; j < column.length; j++) {
      row[column[j]] = result.rows[i][j];
    }
    data.push(row);
    row = {};
  }
  return data;
}

router.get('/', (req, res) => {
  res.send('hello')
})

router.get('/check', function(req, res, next) {
  oracledb.getConnection({
    user : dbConfig.user,
    password : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection) {
    if (err) {
      console.error(err.message)
      return
    }
    
    var param = {
      ID: req.query.id,
    };

    let format = {language: 'sql', indent: ' '}
    let query = mybatisMapper.getStatement('nfc', 'confirm_id', param, format)
    console.log(query)

    connection.execute(query, [], function(err, result) {
      if (err) {
        console.error(err.message)
        res.send('에러')
      } else {
        if (result.rows.length !== 0) {
          var Result = Update_data(result)
          if (Result[0].STATE === 0) {
            res.render('register', {id: req.query.id})
          } else {
            if (Result[0].REQUEST === 0) {
              res.render('request', {id: req.query.id})
            } else {
              res.send('수거요청 되어있습니다.')
            }
          }
        } else {
          res.render('register', {id: req.query.id})
        }
      }
      connection.close()
    })
  })
})

router.post('/register', function(req, res, next) {
  oracledb.getConnection({
    user : dbConfig.user,
    password : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection) {
    if (err) {
      console.error(err.message)
      return
    }
    
    var param = {
      ID: req.body.id,
    };

    let format = {language: 'sql', indent: ' '}
    let query = mybatisMapper.getStatement('nfc', 'confirm_id', param, format)
    console.log(query)

    connection.execute(query, [], function(err, result) {
      if (err) {
        console.error(err.message)
        res.send('에러')
      } else {
        param = {
          ID: req.body.id,
          PHONE: req.body.phone,
          ADDRESS: req.body.address
        }
        if (result.rows.length === 0) {
          query = mybatisMapper.getStatement('nfc', 'register', param, format)
          console.log(query)
        } else {
          query = mybatisMapper.getStatement('nfc', 'update', param, format)
          console.log(query)
        }
        connection.execute(query, [], function(err, result) {
          if (err) {
            console.error(err.message)
            res.send('에러')
          } else {
            res.send('데이터베이스에 저장되었습니다.')
          }
        })
      }
      connection.close()
    })
  })
})

router.post('/request', function(req, res, next) {
  oracledb.getConnection({
    user : dbConfig.user,
    password : dbConfig.password,
    connectString : dbConfig.connectString
  },
  function(err, connection) {
    if (err) {
      console.error(err.message)
      return
    }
    
    var param = {
      ID: req.body.id,
    };

    let format = {language: 'sql', indent: ' '}
    let query = mybatisMapper.getStatement('nfc', 'request', param, format)
    console.log(query)

    connection.execute(query, [], function(err, result) {
      if (err) {
        console.error(err.message)
        res.send('에러')
      } else {
        res.send('수거요청되었습니다.')
      }
      connection.close()
    })
  })
})

module.exports = router