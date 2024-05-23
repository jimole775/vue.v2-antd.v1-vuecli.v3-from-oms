export class Flow {
  constructor (delay = 333) {
    this.flowBus = {
      tasks: [],
      isRunning: false
    }
    this.debunceBus = {
      tasks: [],
      isRunning: false
    }
    // 是否需要立即响应第一次调用
    // 如果选是，则立即执行第一条流程
    // 如果选否，就只执行 delay 之后的最后一次调用
    this.immediate = false
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
    return new Promise((resolve, reject) => {
      if (this.immediate && this.debunceBus.isRunning === false) {
        this.debunceBus.isRunning = true
        setTimeout(() => {
          this.debunceBus.isRunning = false
        }, this.delay)
        return resolve(func(...params))
      } else {
        this.debunceBus.tasks.push(task)
        this._uniqueDebounceQueue()
        setTimeout(() => {
          this._uniqueDebounceQueue()
          const task = this._sliceTasks(this.debunceBus.tasks, func)
          if (task) {
            return resolve(task.run(...task.params))
          } else {
            return resolve(null)
          }
        }, this.delay)
      }
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

  _isNativeFunction (src) {
    return /{ \[native code\] }/.test(src.toString())
  }

  _compare (fun1, fun2) {
    // 如果是 js 元函数，就使用内存地址比对
    if (this._isNativeFunction(fun1) && this._isNativeFunction(fun2)) {
      return fun1 === fun2
    } else {
      return fun1.toString() === fun2.toString()
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
        if (this._compare(ntask.run, task.run)) {
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
