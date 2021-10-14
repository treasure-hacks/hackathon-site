document.querySelectorAll('button.copy').forEach(btn => {
  btn.addEventListener('click', function () {
    const targetText = document.querySelector(`[name="${encodeURIComponent(btn.getAttribute('for'))}"]`)
    if (!targetText) return
    const textarea = document.createElement('textarea')
    textarea.value = targetText.textContent
    document.body.appendChild(textarea)
    textarea.select()
    textarea.setSelectionRange(0, textarea.value.length)
    document.execCommand('copy')
    document.body.removeChild(textarea)

    const icon = btn.querySelector('i.fa')
    icon.classList.add('fa-check')
    icon.classList.remove('fa-copy')
    setTimeout(() => {
      icon.classList.add('fa-copy')
      icon.classList.remove('fa-check')
    }, 1000)
  })
})
