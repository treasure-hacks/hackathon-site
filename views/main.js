/* eslint-disable no-unused-vars */
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

/**
 * Returns an item from or an entire array of ancestor elements
 * @param {HTMLElement} element The element to obtain the tree from
 * @param {number} index The number of nodes to travel up (or down) the tree
 * @param {boolean} topDown Whether to return a top-down tree that starts with
 * the document element and ends with the specified element
 * @returns {HTMLElement | HTMLElement[]} The array if no index is specified, or the node at the
 * specified index of the node tree
 */
function nodeTree (element, index, topDown) {
  const tree = []
  let target = element
  while (target && target !== document.documentElement) {
    tree.push(target)
    target = target.parentNode
  }
  if (topDown) tree.reverse()
  if (index == null) return tree
  return tree[index] || null
}

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
