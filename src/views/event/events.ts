export enum EVENT_TRIGGER_LEVEL {
  Level01 = 1,
  Level02,
  Level03,
  Level04,
  Level05
}

interface EventTask {
  level: EVENT_TRIGGER_LEVEL
  fn: Function
  once: boolean
}

export class Events {
  static eventMap: Map<Symbol, EventTask[]> = new Map()

  public static on(name: Symbol, fn: Function, level?: EVENT_TRIGGER_LEVEL) {
    if (!Events.eventMap.has(name)) {
      Events.eventMap.set(name, [])
    }
    const eventList = Events.eventMap.get(name)!
    const mLevel = level ? level : EVENT_TRIGGER_LEVEL.Level01
    eventList.push({ level: mLevel, fn, once: false })
    eventList.sort((a, b) => a.level - b.level)
  }

  public static once(name: Symbol, fn: Function, level?: EVENT_TRIGGER_LEVEL) {
    if (!Events.eventMap.has(name)) {
      Events.eventMap.set(name, [])
    }
    const eventList = Events.eventMap.get(name)!
    const mLevel = level ? level : EVENT_TRIGGER_LEVEL.Level01
    eventList.push({ level: mLevel, fn, once: true })
    eventList.sort((a, b) => a.level - b.level)
  }

  public static off(name: Symbol, fn: Function) {
    if (Events.eventMap.has(name)) {
      const eventList = Events.eventMap.get(name)!
      const index = eventList.findIndex((e) => e.fn === fn)
      if (index >= 0) {
        eventList.splice(index, 1)
        if (eventList.length === 0) {
          Events.eventMap.delete(name)
        }
      }
    }
  }

  public static emit(name: Symbol, data?: any) {
    if (Events.eventMap.has(name)) {
      const eventList = Events.eventMap.get(name)!
      for (let i = eventList.length - 1; i >= 0; i--) {
        eventList[i].fn(data)
        if (eventList[i].once) {
          eventList.splice(i, 1)
        }
      }
      if (eventList.length === 0) {
        Events.eventMap.delete(name)
      }
    }
  }

  public static delete(name: Symbol) {
    if (Events.eventMap.has(name)) {
      Events.eventMap.delete(name)
    }
  }

  public static clear() {
    Events.eventMap.clear()
  }
}
