splide = new Splide('.mountain-slider', {
  focus: 'center',
  drag: true,
  autoWidth: true,
  gap: '8px',
  trimSpace: false,
  updateOnMove: true,
  flickMaxPages: 0.1
})

const categorySplide = new Splide('.category-box-container', {
  type: 'loop',
  focus: 'center',
  drag: true,
  autoWidth: true,
  gap: '16px',
  trimSpace: false,
  updateOnMove: true,
  flickMaxPages: 0.1
})

window.addEventListener('load', () => {
  splide.mount(window.splide.Extensions)
  splide.root.classList.add('loaded')
  categorySplide.mount(window.splide.Extensions)
})

const regTimeEl = document.querySelector('time.registration-time')
regTimeEl.innerText = new Date(regTimeEl.dateTime).toLocaleString(undefined, {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric'
})
