const infoCards = document.querySelectorAll('.info-card')
infoCards.forEach(card => {
  card.addEventListener('click', e => {
    card.classList.toggle('open')
  })
})

