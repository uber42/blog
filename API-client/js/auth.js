const remote = require('electron').remote
const path = require('path')
const API = require(__dirname.split('html')[0] + 'js/api')
const main = remote.require(__dirname.split('html')[0] + 'main')
      
      
      var button = document.getElementById('authButton')
      button.addEventListener('click', () => {
        var userform = {
          email: document.getElementById('exampleInputEmail1').value,
          password: document.getElementById('exampleInputPassword1').value
        }
        var window = remote.getCurrentWindow()
        main.getJar().then(jar => {
            API.auth(userform, jar).
            then((cookies) => {
              main.setCookies(cookies)
              main.openWindow()
              window.close()
            }).catch((err) => {
              alert(err)
              console.log(err)
          });
        }).catch(err => {
          console.log(err)
        })
        
      })