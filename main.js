// shared resources
let result = 0
let sum1 = 0
let sum2 = 0

// queue implementation
function queue(worker) {
  const queueItems = []
  let isWorking = false

  function runNext() {
    if (isWorking || queueItems.length === 0) {
      return
    }

    isWorking = true
    const item = queueItems.shift()

    worker(item.data, function(value, delay) {
      isWorking = false
      setTimeout(item.callback, 0, value, delay)
      runNext()
    })
  }

  return function(data, callback) {
    queueItems.push({
      data,
      callback
    })
    setTimeout(runNext, 0)
  }
}

function updateDom(id, value) {
  const el = document.querySelector(id)
  el.innerHTML = value
}

function someWorker(value, done) {
  // simulate async action
  const delay = Math.ceil(Math.random() * 3000)

  setTimeout(() => {
    result += value
    updateDom('#result', result)
    done(value, delay)
  }, delay)
}

const updateWorker = queue(someWorker)
const button1 = document.querySelector('#button1')
const button2 = document.querySelector('#button2')

updateDom('#result', result)
updateDom('#sum1', sum1)
updateDom('#sum2', sum2)

button1.addEventListener('click', () => {
  sum1 += 1
  updateDom('#sum1', sum1)

  updateWorker(1, (value, delay) => {
    console.log(`done, plus ${value}, result: ${result}, delayed ${delay}ms`)
  })
})

button2.addEventListener('click', () => {
  sum2 += 2
  updateDom('#sum2', sum2)

  updateWorker(2, (value, delay) => {
    console.log(`done, plus ${value}, result: ${result}, delayed ${delay}ms`)
  })
})