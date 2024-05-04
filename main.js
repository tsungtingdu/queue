// shared resources
let result = 0

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

    worker(item.data, function(value) {
      isWorking = false
      setTimeout(item.callback, 0, value)
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

function updateDom(value) {
  const resultElement = document.querySelector('#result')
  resultElement.innerHTML = value
}

function someWorker(value, done) {
  // simulate async action
  setTimeout(() => {
    result += value
    updateDom(result)
    done(value)
  }, Math.random() * 3000)
}

const updateWorker = queue(someWorker)
const button1 = document.querySelector('#button1')
const button2 = document.querySelector('#button2')
updateDom(result)

button1.addEventListener('click', () => {
  updateWorker(1, value => {
    console.log(`done, plus ${value}`)
  })
})

button2.addEventListener('click', () => {
  updateWorker(2, value => {
    console.log(`done, plus ${value}`)
  })
})