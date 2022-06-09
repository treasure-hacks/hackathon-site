const acc = document.getElementsByClassName('accordion')
let i
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    this.classList.toggle('active')
    const panel = this.nextElementSibling
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px'
    }
  })
}

const toggle = document.getElementById('hamburger')

toggle.addEventListener('click', function () {
  const nav = document.getElementById('navigation')
  if (nav.classList.contains('open')) {
    nav.parentNode.classList.remove('open')
    toggle.className = 'fa fa-bars hamburger fa-lg'
    document.getElementById('navigation').classList.remove('open')
  } else {
    nav.parentNode.classList.add('open')
    document.getElementById('navigation').classList.add('open')
    toggle.className = 'fa fa-close hamburger fa-lg'
  }
})

// Add touchmove listener to set immediate hover states on mobile
document.body.addEventListener('touchmove', () => {})
