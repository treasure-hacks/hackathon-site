const infoCards = document.querySelectorAll('.info-card')
infoCards.forEach(card => {
  card.querySelector('.action-link').addEventListener('click', e => {
    e.preventDefault()
    card.classList.add('open')
  })
  card.querySelector('.card-back').addEventListener('mouseleave', e => {
    // Close card on mouseout if video is not playing
    const myFrameFocused = card.contains(document.activeElement) && document.activeElement.tagName === 'IFRAME'
    if (myFrameFocused) return
    card.classList.remove('open')
  })
})
