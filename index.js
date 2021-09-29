const fs = require('fs')
const path = require('path')
const EventEmitter = require('events')
const changeEmitter = new EventEmitter()
changeEmitter.setMaxListeners(10 ** 30)
const Handlebars = require('handlebars')
require('dotenv').config()

const args = {
  watch: process.argv.indexOf('--watch') > -1,
  serve: process.argv.indexOf('--serve') > -1
}

const newENV = {}
Object.entries(process.env).forEach(entry => {
  const key = entry[0]
  const val = entry[1]
  if (!key.match(/^BUILD_/)) return
  newENV[key.replace(/^BUILD_/, '')] = val
})

function buildApp () {
  // Clear the docs directory
  fs.rmdirSync('docs', { recursive: true })

  function recursiveRoutes (folderName) {
    fs.readdirSync(folderName).forEach(function (file) {
      // For each file in directory, get name and stat
      const fullName = path.join(folderName, file)
      const stat = fs.lstatSync(fullName)

      if (stat.isDirectory()) {
        // Folders
        recursiveRoutes(fullName)
      } else {
        const routeName = fullName.replace(/^views/g, '')

        // Handle file changes
        changeEmitter.on('unwatch', () => {
          fs.unwatchFile('./views' + routeName, watchHandler)
        })
        function watchHandler (curr, prev) {
          console.log('\x1b[32mChange detected, rebuilding...\x1b[0m')
          changeEmitter.emit('unwatch')
          buildApp()
        }

        // Create directory if it doesn't exist
        const dir = folderName.replace(/^views/g, 'docs')
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          })
        }

        if (routeName.match(/\.(hbs)$/)) {
          // Handlebars files
          const template = fs.readFileSync('./views' + routeName, 'utf-8')
          const renderTemplate = Handlebars.compile(template)
          const html = renderTemplate(newENV)
          fs.writeFile('./docs' + routeName.replace(/\.hbs$/, ''), html, err => {
            if (err) return console.log(err)
          })
        } else {
          // Copy other (static) files
          fs.copyFile('./views' + routeName, './docs' + routeName, err => {
            if (err) return console.log(err)
          })
        }

        if (args.watch) fs.watchFile('./views' + routeName, { interval: 100 }, watchHandler)
      }
    })
  }
  recursiveRoutes('views')
}
buildApp()

if (args.serve) {
  const express = require('express')
  const http = require('http')
  const app = express()
  app.use(express.static('./docs/'))
  http.createServer(app).listen(5700, () => {
    console.log('\x1b[36mListening on port 5700\x1b[0m')
  })
}
