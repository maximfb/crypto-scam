document.addEventListener('DOMContentLoaded', () => {
  initPreloader()
  initCustomCursor() 
  copyPresaleHandler()
  initCustomCursor()
  openModalHandler(document.querySelector('#presale-modal'), document.querySelector('#presale-btn'))
})

function initPreloader() {
  const Opt = {
    CandleCount: 81,
    Down: '_down',
    Up: '_up',
  }
  const windowHeight = window.innerHeight;
  const preloader = document.querySelector('#preloader');
  const chart = preloader.querySelector('#chart')
  document.documentElement.classList.add('_no-scroll');
  
  const chartItems = new Array(Opt.CandleCount).fill().map((_, i) => {
    return { 
      color: i % 2 === 0 ? Opt.Up : Opt.Down, 
      width: 1, // vw
      height: i !== Opt.CandleCount - 1 ? (Math.floor(Math.random() * windowHeight * 0.007) + 1)  : 100 //vh
    }
  })

  for (let i = 0; i < chartItems.length; i++) {
    const {color, width, height} = chartItems[i]
    let posX = 0
    let posY = 0

    if (i !== 0) {
      posX = width * i
      posY = color === Opt.Down ? -chartItems[i - 1].height : -chartItems[i - 1].height
    }

    const candle = document.createElement('div')
    candle.classList.add('candle')
    candle.classList.add(color);
  
    candle.style.cssText = `
      width: ${width}vw;
      height: ${height}vh;
      transform: translate(${posX}vw, ${posY}vh);
    `
    chart.appendChild(candle)
  }

  const candles = document.querySelectorAll('.candle');
  let dic = 0
  candles.forEach((candle, index) => {
    const delay = (index + 1) * 60;
    setTimeout(() => candle.classList.add('visible'), delay);
  });

  setTimeout(() => {
    preloader.classList.add('_isLoaded')
    document.documentElement.classList.remove('_no-scroll');
  }, Opt.CandleCount * 60 + 300)
}

function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('cursor')
  document.body.appendChild(cursor)

  document.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
  });

  document.querySelectorAll('.-inv').forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('_isInverted');
    });

    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('_isInverted');
    });
});
}

function openModalHandler(modal, trigger) {
  const IS_OPEN = '_isOpen'
  const content = modal.querySelector('.modal__content')
  const overlay = modal.querySelector('.modal__overlay')

  content.onclick = function(e) {
    e.stopPropagation()
  }
  overlay.onclick = function() {  
    modal.classList.remove(IS_OPEN);
    content.classList.toggle(IS_OPEN)
  }
  trigger.onclick = function() {
    modal.classList.toggle(IS_OPEN);
    content.classList.toggle(IS_OPEN)
  }
}

function copyPresaleHandler() {
  const copy = document.querySelector('.copy-input')
  copy.querySelector('button').onclick = function() {
    toCopy(String(copy.querySelector('input').value))
  }
}

function showAlertHanlder(text, ms = 1000) {
  const box = document.querySelector('main')
  const { template: alert, id } = createAlert(text)  
  box.insertAdjacentHTML('beforeend', alert)
  const alertInBody = document.getElementById(id)
  if (alertInBody) setTimeout(() => document.getElementById(id).remove(), ms)
}

function toCopy(text) {
  try {
    navigator.clipboard.writeText(text)
      .then(showAlertHanlder('Скопировано!'))
  } catch(err) {
    console.error('Error while toCopy', err.message)
  }
}

function createAlert(text) {
  const id = new Date()
  return {
    template: `
    <section class="alert" role="dialog" id="${id}">
      <div class="container">
        <div class="alert__content">
          <p>${text}</p>
        </div>
      </div>
    </section>
    `,
    id
  }
}