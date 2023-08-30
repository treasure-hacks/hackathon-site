const form = document.querySelector('form')

function save () {
  const data = new FormData(form)
  const entries = [...(new URLSearchParams(data)).entries()]
  localStorage.savedRegistration = JSON.stringify(entries)
}
function load () {
  updateConditionalShows() // Hide at first so that if it returns, it's still updated
  const entries = JSON.parse(localStorage.savedRegistration || '0')
  if (!entries) return
  for (const [key, val] of entries) {
    const input = form.elements[key]
    if (!input) continue
    if (input instanceof RadioNodeList) {
      const el = [...input].find(e => e.value === val)
      if (el) el.checked = true
      updateValidity(el)
      continue
    }
    switch (input.type) {
      case 'file': input.value = ''; break
      case 'checkbox': input.checked = !!val; break
      case 'hidden': break
      default: input.value = val; break
    }
    updateValidity(input)
  }
  updateConditionalShows()
  // Recalculate textarea heights
  document.querySelectorAll('textarea').forEach(restyleHeight)
}

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

const currentURL = new URL(location.href)
document.getElementById('referrer-input').value = currentURL.origin + currentURL.pathname

async function validateDiscord (value) {
  const endpoint = form.action + '/discord?user='
  const response = await fetch(endpoint + encodeURIComponent(value)).then(x => x.json())
  return response
}

function getQuestionContainer (el) {
  return nodeTree(el).find(el => el.classList.contains('item-container'))
}
async function updateValidity (input, blankIsInvalid) {
  const questionEl = getQuestionContainer(input)
  if (!questionEl) return
  const errorEl = questionEl.querySelector('.error span')
  if (input.value === '' && !blankIsInvalid) return
  if (input.name.endsWith('__other')) return
  let validity = input.validity && input.validity.valid
  if (input.type === 'checkbox') {
    const checked = questionEl.querySelectorAll('input:checked').length
    const { min, max } = questionEl.dataset
    validity = (min || 0) <= checked && checked <= (max || Infinity)
  } else if (input.type === 'file') {
    const file = input.files[0]
    if (file) {
      const mimetype = file.type
      const validType = ['application/pdf', 'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimetype)
      const validSize = file.size < parseInt(input.max)
      if (!validType) errorEl.innerText = 'File must be a .pdf, .doc, or .docx file'
      else if (!validSize) errorEl.innerText = 'File must be at most 5MB'
      validity = validity && validType && validSize
    }
    if (blankIsInvalid) validity = validity && !!file
  } else if (questionEl.querySelector('.input-wrapper[data-autofill]')) {
    const options = [...questionEl.querySelectorAll('.autofill-container p')]
      .map(el => el.innerText)
    if (!questionEl.querySelector('.hold-focus')) {
      // Only if not holding focus
      validity = validity && (!options.length || options.includes(input.value))
    }
  }
  questionEl.classList.toggle('invalid', !validity)
  if (errorEl.dataset.originalError) {
    errorEl.innerText = errorEl.dataset.originalError
  }
  if (!questionEl.dataset.validation || !validity) return
  switch (questionEl.dataset.validation) {
    case 'user_in_server': {
      const response = await validateDiscord(input.value)
      const { errorHTML } = response
      updateCustomValidity(questionEl, !!response.success, errorHTML || response.error, !!errorHTML)
    }
  }
}
function updateCustomValidity (container, valid, error, isHTML) {
  container.classList.toggle('invalid', !valid)
  if (!error) return
  const errorEl = container.querySelector('.error span')
  if (!errorEl.dataset.originalError) errorEl.dataset.originalError = errorEl.innerText
  errorEl[isHTML ? 'innerHTML' : 'innerText'] = error
}

function updateConditionalShows () {
  document.body.querySelectorAll('[data-show-if]').forEach(el => {
    const ids = el.dataset.showIf.split(',')
    // Hide if none of the showIf elements are checked
    const hiddenBefore = el.hidden
    el.hidden = ids.every(id => !document.getElementById(id)?.checked)
    if (el.hidden === hiddenBefore) return
    el.querySelectorAll('input, textarea').forEach(input => {
      if (el.hidden) {
        input.dataset.required = input.required
        input.required = false
      } else {
        input.required = input.dataset.required === 'true'
        delete input.dataset.required
      }
    })
  })
}

document.body.addEventListener('change', (e) => {
  save()
  updateValidity(e.target, e.target.required)
})

document.body.addEventListener('focusout', (e) => {
  const questionEl = getQuestionContainer(e.target)
  // Only make invalid on focusout
  if (e.target.validity && e.target.validity.valid === false) questionEl.classList.add('invalid')
}, { capture: true })

function restyleHeight (textarea) {
  textarea.style.height = '' // So that scroll height is based on content rather than styled height
  textarea.style.height = Math.max(textarea.scrollHeight + 2, 42) + 'px'
}

document.body.addEventListener('input', (e) => {
  const questionEl = getQuestionContainer(e.target)
  // Every input event should only make things valid, not invalid
  const valid = e.target.validity && e.target.validity.valid
  if (valid && !e.target.name.endsWith('__other')) questionEl.classList.remove('invalid')
  updateConditionalShows()

  // Auto-adjust height of textareas
  if (e.target.nodeName === 'TEXTAREA') restyleHeight(e.target)
}, { capture: true })

form.addEventListener('submit', e => {
  let firstInvalidField = form.querySelector('.invalid.item-container:not([hidden])')
  if (!firstInvalidField && document.activeElement.tagName === 'INPUT') {
    document.activeElement.parentNode.classList.remove('hold-focus')
    updateValidity(document.activeElement, document.activeElement.required)
    firstInvalidField = form.querySelector('.invalid.item-container:not([hidden])')
  }
  if (!firstInvalidField) {
    form.querySelectorAll('.item-container input').forEach(el => updateValidity(el, el.required))
    firstInvalidField = form.querySelector('.invalid.item-container:not([hidden])')
  }
  if (!firstInvalidField) return
  firstInvalidField.scrollIntoView()
  if (!firstInvalidField.querySelector('input:invalid')) e.preventDefault() // HTML Input is not invalid
  firstInvalidField.querySelector('input')?.focus()
})

// eslint-disable-next-line
let countryList = []
// eslint-disable-next-line
let schoolList = []

window.addEventListener('load', () => {
  load()
  const formErrors = new URL(location.href).searchParams.get('errors')
  if (!formErrors) return
  formErrors.split(',').forEach(name => {
    const input = form.querySelector(`input[name="${name}"]`)
    if (input) updateValidity(input, true)
  })
  const firstInvalidField = form.querySelector('.invalid.item-container')
  if (firstInvalidField) return firstInvalidField.scrollIntoView()
  setTimeout(() => {
    alert(`The server could not process the following fields: ${formErrors.replace(/,/g, ', ')}. ` +
      'Please contact the Treasure Hacks organizers on Discord.')
  }, 400)
})

const dateOptions = {
  timeZone: 'America/Los_Angeles',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
}
function showDateTime (element) {
  const startDate = new Date(element.dateTime)
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  element.innerText = startDate.toLocaleString(undefined, { timezone, ...dateOptions }) + ` (${timezone.replace(/_/g, ' ')})`
  element.title = element.dataset.description + ', adjusted for your time zone'
}
document.querySelectorAll('.item-container time[datetime]').forEach(showDateTime)
