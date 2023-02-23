const form = document.querySelector('form')
function test () {
  const data = [...new FormData(form).entries()].map(([inputName, value]) => {
    const element = document.querySelector(`[name="${inputName}"]:not([type=radio]:not(:checked))`)
    const type = element.dataset.type || element.type
    const name = element.dataset.for || inputName
    return { name, value, element, type }
  }).filter(({ value, type }) => (type !== 'file' && value) || value.size)
  return data.reduce((dict, next) => {
    switch (next.type) {
      case 'checkbox': {
        const arr = dict[next.name] || []
        arr.push(next.value)
        dict[next.name] = arr
        break
      }
      case 'number': dict[next.name] = Number(next.value); break
      case 'boolean': dict[next.name] = !!Number(next.value); break
      default: dict[next.name] = next.value
    }
    return dict
  }, {})
}

form.addEventListener('submit', e => {
  // Check validity of form; prevent submission if client says invalid.
  // Server will still validate, of course

  console.log(test())
  // e.preventDefault()
})

function save () {
  const data = new FormData(form)
  const entries = [...(new URLSearchParams(data)).entries()]
  localStorage.FORMTHING = JSON.stringify(entries)
}

function load () {
  const entries = JSON.parse(localStorage.FORMTHING)
  for (const [key, val] of entries) {
    const input = form.elements[key]
    if (!input) continue
    if (input instanceof RadioNodeList) {
      const el = [...input].find(e => e.value === val)
      if (el) el.checked = true
      continue
    }
    switch (input.type) {
      case 'file': input.value = ''; break
      case 'checkbox': input.checked = !!val; break
      default: input.value = val; break
    }
  }
}

document.getElementById('referrer-input').value = location.href
document.body.addEventListener('change', () => {
  save()
})
window.addEventListener('load', () => {
  const formErrors = new URL(location.href).searchParams.get('errors')
  console.log('Errors:', formErrors)
  load()
})
