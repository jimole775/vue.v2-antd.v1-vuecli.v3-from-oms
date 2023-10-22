export class Flow {
  constructor (delay = 333) {
    this.flowBus = {
      tasks: [],
      isRunning: false
    }
    this.debunceBus = {
      tasks: []
    }
    this.delay = delay
  }

  async call (func, ...params) {
    this.flowBus.tasks.push({ run: func, params })
    return new Promise((resolve, reject) => {
      return this._flowHandler(func, resolve, reject)
    })
  }

  async debounce (func, ...params) {
    const task = { run: func, params }
    this.debounceBus.tasks.push(task)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._uniqueDebounceQueue()
        const task = this._sliceTasks(this.debounceBus.tasks, func)
        if (task) {
          return resolve(task.run(...task.params))
        } else {
          return resolve(null)
        }
      }, this.delay)
    })
  }
  // 在无限调用过程中，一次只执行一条
  // 在未执行完成前，其他的调用都进入自循环中，直到所有调用执行完成为止
  _flowHandler (runSymbol, resolve) {
    if (this.flowBus.isRunning === false) {
      this.flowBus.isRunning = true
      return this._flowConsuming(runSymbol, resolve)
    } else {
      setTimeout(() => {
        return this._flowHandler(runSymbol, resolve)
      }, this.delay)
    }
  }

  // todo 未正确实现 flow 功能
  async _flowConsuming (runSymbol, resolve) {
    if (this.flowBus.tasks.length) {
      const task = this._sliceTasks(this.flowBus.tasks, runSymbol)
      const res = await task.run(...task.params)
      this.flowBus.isRunning = false
      return resolve(res)
    } else {
      this.flowBus.isRunning = false
      return resolve(null)
    }
  }

  _uniqueDebounceQueue () {
    const tasks = this.debounceBus.tasks
    const newTasks = []
    for (let i = tasks.length - 1; i >= 0; i--) {
      const task = tasks[i]
      let already = false
      for (let j = 0; j < newTasks.length; j++) {
        const ntask = newTasks[i]
        if (ntask.run === task.run) {
          already = true
          break
        }
      }
      if (already === false) {
        newTasks.push(task)
      }
    }
    this.debunceBus.tasks = newTasks
  }

  _sliceTasks (tasks, runSymbol) {
    const task = tasks.find((task, index) => {
      task.index = index
      return task.run === runSymbol
    })
    task && tasks.splice(task.index, 1)
    return task
  }
}

export default new Flow()
