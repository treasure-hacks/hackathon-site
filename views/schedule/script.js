fetch('https://sheets.googleapis.com/v4/spreadsheets/1ertyB2ghKnPeYfUUjZsi2ftVOIz3mcKfnyoPetBxtH8/values/Schedule!A:D?key=AIzaSyD5Kb_Kx_oPXxVEF-mceaf_azoeoYTmhqA')
  .then(r => r.json()).then(data => {
    const table = document.getElementById('schedule-table')
    const template = document.getElementById('event-template')
    if (data.error) return
    table.innerHTML = ''
    data.values.forEach(columns => {
      const row = template.content.cloneNode(true)
      row.querySelector('.date').innerText = columns[0]
      row.querySelector('.start-time span').innerText = columns[1]
      row.querySelector('.event-name').innerText = columns[3]
      const endTime = columns[2]
      if (!endTime) {
        row.querySelector('.start-time .small-table-info').remove()
        row.querySelector('.end-time').innerText = '\u2013'
      } else {
        row.querySelector('.start-time .small-table-info').innerText = '\u2013 ' + endTime
        row.querySelector('.end-time').innerText = endTime
      }
      table.appendChild(row)
    })
  })
