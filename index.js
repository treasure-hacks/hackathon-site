const fs = require('fs')
const path = require('path')
const watch = require('node-watch')
const EventEmitter = require('events')
const changeEmitter = new EventEmitter()
changeEmitter.setMaxListeners(10 ** 30)
const Handlebars = require('handlebars')
require('dotenv').config()

const args = {
  watch: process.argv.indexOf('--watch') > -1,
  serve: process.argv.indexOf('--serve') > -1
}

// Config using config.js and ENV vars
const config = require('./config')
Object.entries(process.env).forEach(entry => {
  const key = entry[0]
  const val = entry[1]
  if (!key.match(/^BUILD_/)) return
  config[key.replace(/^BUILD_/, '')] = val
})

// Render Templates
function renderTemplate (renderer, path) {
  try {
    return renderer(config)
  } catch (error) {
    console.log(`\x1b[31mHandlebars compile error: ${path}\x1b[0m`)
    return config.hbs_compile_error_msg
  }
}

// Register Handlbars Partial Views
function recursivePartials (folderName) {
  fs.readdirSync(folderName).forEach(function (file) {
    // For each file in directory, get name and stat
    const fullName = path.join(folderName, file)
    const stat = fs.lstatSync(fullName)
    if (stat.isDirectory()) {
      // Folders
      recursivePartials(fullName)
    } else {
      const routeName = fullName.replace(/^partials\//g, '')
      const partialName = routeName.replace(/\.hbs$/, '')
      const template = fs.readFileSync('./partials/' + routeName, 'utf-8')
      const renderer = Handlebars.compile(template)
      Handlebars.registerPartial(partialName, renderer)
      console.log(partialName)
    }
  })
}
recursivePartials('partials')
// Watch changes
watch('partials', { recursive: true }, function (evt, name) {
  if (evt !== 'remove') {
    const stat = fs.lstatSync(name)
    if (stat.isDirectory()) return
  }

  console.log(`\x1b[32mChange detected, rebuilding... (${evt + ' ' + name}) \x1b[0m`)
  const partialName = name.replace(/^partials\/|\.hbs$/g, '')

  // Update Partial by re-registering it
  if (evt !== 'remove') {
    const template = fs.readFileSync(name, 'utf-8')
    const renderer = Handlebars.compile(template)
    Handlebars.registerPartial(partialName, renderer)
  }

  // Rebuild the app using the template
  buildApp()
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
          const renderer = Handlebars.compile(template)
          const html = renderTemplate(renderer, './views' + routeName)
          fs.writeFile('./docs' + routeName.replace(/\.hbs$/, ''), html, err => {
            if (err) return console.log(err)
          })
        } else {
          // Copy other (static) files
          fs.copyFile('./views' + routeName, './docs' + routeName, err => {
            if (err) return console.log(err)
          })
        }
      }
    })
  }
  recursiveRoutes('views')

  watch('views', { recursive: true }, function (evt, name) {
    console.log(`\x1b[32mChange detected, rebuilding... (${evt + ' ' + name}) \x1b[0m`)
    buildApp()
  })
}
buildApp()

if (args.serve) {
  const express = require('express')
  const http = require('http')
  const app = express()
  app.use(express.static('./docs'))
  http.createServer(app).listen(5700, () => {
    console.log('\x1b[36mListening on port 5700\x1b[0m')
  })
}
