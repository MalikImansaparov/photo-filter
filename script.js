
const config = {
  blur: '0px',
  invert: '0%',
  sepia: '0%',
  saturate: '100%',
  hue: '0deg'
}

class PhotoFilter {
  constructor() {
    this.#init()
    this.drawImage()
  }

  #init() {
    this.src = "assets/img/img.jpg"
    this.number = 0
    this.canvas = document.querySelector('canvas')
    this.ctx = this.canvas.getContext('2d')
    this.filters = {}
    for (let filter in config) {
      this.filters[filter] = config[filter]
    }

    // Change filters
    const filtersContainer = document.querySelector('.filters')
    filtersContainer.addEventListener('input', (e) => {
      const elem = e.target
      const name = elem.getAttribute('name')
      const value = elem.value
      const sizing = elem.dataset.sizing
      elem.nextElementSibling.value = value
      this.filters[name] = value + sizing
      this.drawImage()
    })

    // Click buttons
    const buttonsContainer = document.querySelector('.btn-container')
    buttonsContainer.addEventListener('click', (e) => {
      if (!e.target.dataset.name) return
      const name = e.target.dataset.name
      this[name]()
    })

    // Load image
    const fileInput = document.querySelector('input[type=file]')
    fileInput.addEventListener('change', function (e) {
      const file = fileInput.files[0]
      const reader = new FileReader()
      reader.onload = function () {
        this.src = reader.result
        this.drawImage()
      }.bind(this)
      reader.readAsDataURL(file)
      e.target.value = ''
    }.bind(this))
  }

  drawImage() {
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.src = this.src
    img.onload = function () {
      this.canvas.width = img.width
      this.canvas.height = img.height
      this.ctx.filter = this.filtersToString()
      this.ctx.drawImage(img, 0, 0)
    }.bind(this)
  }

  reset() {
    for (let filter in config) {
      this.filters[filter] = config[filter]
    }

    Array.from(document.querySelectorAll('.filters input')).forEach((elem) => {
      const name = elem.getAttribute('name')
      const value = Number.parseInt(this.filters[name])
      elem.value = value
      elem.nextElementSibling.value = value
    })
    this.drawImage()
  }

  save() {
    var link = document.createElement('a')
    link.download = 'download.png'
    link.href = this.canvas.toDataURL()
    link.click()
    link.delete
  }

  next() {
    const hour = new Date().getHours()
    let time
    if (hour < 6) {
      time = 'night'
    } else if (hour < 12) {
      time = 'morning'
    } else if (hour < 18) {
      time = 'day'
    } else if (hour < 24) {
      time = 'evening'
    }

    this.number += 1
    this.number = this.number > 20 ? 1 : this.number
    this.src = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${time}/${String(this.number).length > 1 ? this.number : '0' + this.number}.jpg`
    this.drawImage()
  }

  filtersToString() {
    let res = ""
    for (let filter in this.filters) {
      res +=
        filter === 'hue'
          ? `hue-rotate(${this.filters[filter]}) `
          : `${filter}(${this.filters[filter]}) `
    }
    return res.trim()
  }
}
const p = new PhotoFilter()
window.p = p

// FullScreen mode
function activateFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen()
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen()
  }
}
function deactivateFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}
const fullscreenButton = document.querySelector('.openfullscreen')
fullscreenButton.addEventListener('click', () => {

  const fullscreenElement = document.fullscreenElement
    || document.mozFullScreenElemen
    || document.webkitFullscreenElement;

  fullscreenElement ? deactivateFullscreen() : activateFullscreen()
})

