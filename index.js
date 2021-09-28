const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')
require('dotenv').config()

fs.rmdirSync('docs', { recursive: true })

const newENV = {}
Object.entries(process.env).forEach(entry => {
  const key = entry[0]
  const val = entry[1]
  if (!key.match(/^BUILD_/)) return
  newENV[key.replace(/^BUILD_/, '')] = val
})

function recursiveRoutes (folderName) {
  fs.readdirSync(folderName).forEach(function (file) {
    const fullName = path.join(folderName, file)
    const stat = fs.lstatSync(fullName)

    if (stat.isDirectory()) {
      recursiveRoutes(fullName)
    } else {
      const routeName = fullName.replace(/^views/g, '')

      function watchHandler (curr, prev) {
        console.log('\x1b[32mChange detected, restarting...\x1b[0m')
        fs.unwatchFile('./views' + routeName, watchHandler)
        recursiveRoutes('views')
      }
      fs.unwatchFile('./views' + routeName, watchHandler)

      // Create directory if it doesn't exist
      const dir = folderName.replace(/^views/g, 'docs')
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true
        })
      }

      if (routeName.match(/\.(hbs|js)$/)) {
        const template = fs.readFileSync('./views' + routeName, 'utf-8')
        const renderTemplate = Handlebars.compile(template)
        const html = renderTemplate(newENV)
        fs.writeFile('./docs' + routeName.replace(/\.hbs$/, ''), html, err => {
          if (err) return console.log(err)
          console.log('File written succesfully: ' + routeName.replace(/\.hbs$/, ''))
        })
      } else {
        fs.copyFile('./views' + routeName, './docs' + routeName, err => {
          if (err) return console.log(err)
          console.log('File copied succesfully: ' + routeName)
        })
      }
      fs.watchFile('./views' + routeName, { interval: 100 }, watchHandler)
    }
  })
}
recursiveRoutes('views')
