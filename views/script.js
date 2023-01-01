splide = new Splide('.mountain-slider', {
  focus: 'center',
  drag: true,
  autoWidth: true,
  gap: '8px',
  trimSpace: false,
  updateOnMove: true,
  flickMaxPages: 0.1
})

window.addEventListener('load', () => {
  splide.mount(window.splide.Extensions)
  splide.root.classList.add('loaded')
})
