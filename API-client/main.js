const {app, BrowserWindow} = require('electron')
var request = require('request')
var url = require('url')
var path = require('path')
var API = require('./api')

var j = request.jar();
var cookies = null


function createWindow(){
    let win = new BrowserWindow({width: 400, height: 300})

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'start.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.setMenu(null)
    win.webContents.openDevTools()

    win.on('closed', () => {
        win = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
})

app.on('activate', () => {
   if (win === null) {
     createWindow()
   }
 })

module.exports.openWindow = () => {
    let win = new BrowserWindow({width: 800, height: 600})
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'home.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.setMenu(null)
    win.webContents.openDevTools()
}

module.exports.setCookies = (cookie) => {
    cookies = cookie
}

module.exports.Cookies = () => {
    return new Promise((resolve, reject) => {
        if(cookies){
            resolve(cookies)
        } else {
            reject('Ошибка')
        }
    })
}

module.exports.getCookies = () => {
    return cookies
}

module.exports.getJar = () => {
    return new Promise((resolve, reject) => {
        if(j){
            resolve(j)
        } else {
            reject('Нету jar')
        }
    })
}