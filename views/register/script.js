const form = document.querySelector('form')
// function test () {
//   const data = [...new FormData(form).entries()].map(([inputName, value]) => {
//     const element = document.querySelector(`[name="${inputName}"]:not([type=radio]:not(:checked))`)
//     const type = element.dataset.type || element.type
//     const name = element.dataset.for || inputName
//     return { name, value, element, type }
//   }).filter(({ value, type }) => (type !== 'file' && value) || value.size)
//   return data.reduce((dict, next) => {
//     switch (next.type) {
//       case 'checkbox': {
//         const arr = dict[next.name] || []
//         arr.push(next.value)
//         dict[next.name] = arr
//         break
//       }
//       case 'number': dict[next.name] = Number(next.value); break
//       case 'boolean': dict[next.name] = !!Number(next.value); break
//       default: dict[next.name] = next.value
//     }
//     return dict
//   }, {})
// }

// form.addEventListener('submit', e => {
//   // Check validity of form; prevent submission if client says invalid.
//   // Server will still validate, of course

//   console.log(test())
//   // e.preventDefault()
// })

function save () {
  const data = new FormData(form)
  const entries = [...(new URLSearchParams(data)).entries()]
  localStorage.FORMTHING = JSON.stringify(entries)
}
function load () {
  updateConditionalShows() // Hide at first so that if it returns, it's still updated
  const entries = JSON.parse(localStorage.FORMTHING || '0')
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
      default: input.value = val; break
    }
    updateValidity(input)
  }
  updateConditionalShows()
}

document.getElementById('referrer-input').value = location.href

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
    const { min } = questionEl.dataset
    validity = min <= checked
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
      updateCustomValidity(questionEl, !!response.success, response.error)
    }
  }
}
function updateCustomValidity (container, valid, error) {
  container.classList.toggle('invalid', !valid)
  if (!error) return
  const errorEl = container.querySelector('.error span')
  if (!errorEl.dataset.originalError) errorEl.dataset.originalError = errorEl.innerText
  errorEl.innerText = error
}

function updateConditionalShows () {
  document.body.querySelectorAll('[data-show-if]').forEach(el => {
    const source = document.getElementById(el.dataset.showIf)
    el.hidden = !source.checked
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

document.body.addEventListener('input', (e) => {
  const questionEl = getQuestionContainer(e.target)
  // Every input event should only make things valid, not invalid
  const valid = e.target.validity && e.target.validity.valid
  if (valid && !e.target.name.endsWith('__other')) questionEl.classList.remove('invalid')
  updateConditionalShows()
}, { capture: true })

form.querySelector('input[type="submit"]').addEventListener('click', e => {
  let firstInvalidField = form.querySelector('.invalid.item-container')
  if (!firstInvalidField) {
    form.querySelectorAll('.item-container input').forEach(el => updateValidity(el, el.required))
    firstInvalidField = form.querySelector('.invalid.item-container')
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
    const firstInvalidField = form.querySelector('.invalid.item-container')
    if (firstInvalidField) firstInvalidField.scrollIntoView()
  })
})
