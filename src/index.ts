import Vue from 'vue'

type PermissionMap = Record<string, string | boolean | null>

interface DirectiveBinding {
  value: any
  oldValue: any
}

interface UnwatchFunction {
  (): void
}

interface watchCallbackFunction {
  (newValue: any, oldValue: any): void
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isArray(value: unknown): value is string[] {
  return Array.isArray(value)
}

function isPlainObject(value: unknown): value is PermissionMap {
  return Object.prototype.toString.call(value) === '[object Object]'
}

/**
 * 使用权限控制
 * @param {PermissionMap} initPermissionMap - 初始权限映射
 * @returns {Object} - 包含组件、指令、设置权限、判断权限和监听权限的方法
 */
export default function usePermission(initPermissionMap: PermissionMap) {
  const internalPermissionMap = isPlainObject(initPermissionMap)
    ? initPermissionMap
    : {}

  const vm = new Vue({
    data: {
      permissionMap: {
        ...internalPermissionMap
      }
    }
  })

  /**
   * 设置权限
   * @param {string|Object} key - 权限键
   * @param {string|boolean|null} value - 权限值
   */
  function setPermission(key: string | PermissionMap, value?: string | boolean | null) {
    if (!isString(key) && !isPlainObject(key)) return
    const keyMap = isString(key) ? { [key]: value } : key
    Object.keys(keyMap).forEach(k => {
      vm.$set(vm.permissionMap, k, keyMap[k])
    })
  }

  /**
   * 判断是否具有权限
   * @param {string} key - 权限键
   * @returns {boolean} - 是否具有权限
   */
  function hasPermission(key: string) {
    return !!vm.permissionMap[key]
  }

  /**
   * 监听权限变化
   * @param {string} key - 权限键
   * @param {watchCallbackFunction} cb - 回调函数
   * @returns {UnwatchFunction} - 取消监听的函数
   */
  function watchPermission(key: string, cb: watchCallbackFunction): UnwatchFunction{
    return vm.$watch(() => vm.permissionMap[key], cb)
  }

  /**
   * 判断是否具有多个权限
   * @param {Array} arr - 权限数组
   * @returns {boolean} - 是否具有多个权限
   */
  function _hasPermission(arr: string[]) {
    return isArray(arr) && arr.every(v => hasPermission(v))
  }

  /**
   * 权限组件
   * @param {string|Array} name - 权限名称
   */
  const component = {
    name: 'Permission',
    functional: true,
    props: {
      name: { type: [String, Array], default: () => [] }
    },
    render: (h: Function, { props, slots }:{ props: { name: string | string[] }, slots: Function }) => {
      const nameArray = isString(props.name) ? [props.name] : props.name
      return _hasPermission(nameArray) ? slots().default : null
    }
  }

  /**
   * 监听器映射
   */
  const watcherMap = new Map<HTMLElement, UnwatchFunction[]>()

  /**
   * 设置元素的显示
   * @param {HTMLElement} el - 元素
   * @param {boolean} visible - 是否显示
   */
  function _setElementDisplay(el: HTMLElement, visible: boolean) {
    el.style.display = visible ? el.dataset.display as string : 'none'
  }

  /**
   * 标准化指令值
   * @param {any} value - 指令值
   * @returns {Array} - 指令值数组
   */
  function _normalizeDirectiveValue(value: any): string[] {
    if (!isString(value) && !isArray(value)) return []
    return isArray(value) ? value : [value]
  }

  /**
   * 处理指令
   * @param {HTMLElement} el - 元素
   * @param {any} value - 指令值
   */
  function handleDirective(el: HTMLElement, value: any) {
    const keys = _normalizeDirectiveValue(value)
    _setElementDisplay(el, _hasPermission(keys))
    const oldWatchers = watcherMap.get(el) || []
    oldWatchers.forEach(unwatch => unwatch())
    const unwatchers = keys.map(key => {
      return watchPermission(key, () =>
        _setElementDisplay(el, _hasPermission(keys))
      )
    })
    watcherMap.set(el, unwatchers)
  }

  /**
   * 权限指令
   */
  const directive = {
    bind(el: HTMLElement, { value }: DirectiveBinding) {
      Vue.nextTick(() => {
        el.dataset.display = getComputedStyle(el).display
        handleDirective(el, value)
      })
    },
    update(el: HTMLElement, { value, oldValue }: DirectiveBinding) {
      if (value === oldValue) return
      handleDirective(el, value)
    }
  }

  return {
    component,
    directive,
    setPermission,
    hasPermission,
    watchPermission
  }
}