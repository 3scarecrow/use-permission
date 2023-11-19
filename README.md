# usePermission
一个以指令、组件和方法等方式来管理权限数据的工具

该工具适用于一些需要**权限控制**的地方，例如操作权限，访问页面权限等等

## 安装

```sh
yarn add @3scarecrow/use-permission

# or

npm install @3scarecrow/use-permission
```

## 用法

> **/permission.js

```js
import Vue from 'vue'
import usePermission from '@3scarecrow/use-permission'

const {
  component,
  directive,
  setPermission,
  hasPermission,
  watchPermission,
} = usePermission()

// 注册返回的 vue 组件格式数据
Vue.use('Permission', component)
// 注册返回的 vue 指令格式数据
Vue.directive('permission', directive)

export {
  setPermission,
  hasPermission,
  watchPermission
}
```

可在 `main.js` 文件中引入 `permission.js` 文件

> main.js

```js
// ...
import './permission.js'
```

之后可在 router 的 beforeEach 导航守卫去获取全部的权限，并保存当前用户的权限

```js
import { setPermission, hasPermission } from '**/permission'

router.beforeEach(async (to, from, next) => {
  // 还没获取权限，则调接口获取权限
  if (!hasPermission('obtained')) {
    const permissionList = await getPermission()
    // 设置已获取权限
    setPermission('obtained', true)
    // 假如 permissionList = ['sys.export', 'sys.delete']
    permissionList.forEach(key => {
      setPermission(key, true)
    })
  }
})
```

组件中使用如下

> src/views/index.vue

```vue
<template>
  <!-- 以组件形式使用 -->
  <Permission name="sys.export">
    <button>导出</button>
  </Permission>
  <!-- 以指令形式使用 -->
  <button v-permission="'sys.export'">导出</button>
  <!-- 还可以方法形式使用 -->
  <button v-if="hasPermission('sys.export')"></button>
</template>

<script>
import { hasPermission } from '***/permission.js'
export default {
  methods: {
    hasPermission
  }
}
</script>
```

## API

### usePermission

- **类型:** `Function`

- **参数:** `{Object} initPermissionMap`

- **返回值:** `{Object}`

- **用法:**

  调用该工厂函数可得到组件、指令、以及方法

  ```js
  const {
    component,
    directive,
    hasPermission,
    setPermission,
    watchPermission
  } = usePermission({})
  ```

  返回对象的各个属性具体可参考下面对应属性的说明

### component

- **类型:** `Component`

- **用法:**

  通过以组件方式来控制按钮是否有权限显示

  ```vue
  <!-- 使用字符类型控制按钮显示 -->
  <AuthPermission name="sys.export">
    <button>导出</button>
  </AuthPermission>

  <!-- 对于需要多个权限控制显示的可使用数组的数据类型 -->
  <AuthPermission :name="['sys.export', 'sys.delete']">
    <button>导出</button>
  </AuthPermission>
  ```

  - **Props**

  | 参数 | 类型 | 默认值 | 说明 |
  | ---- | --- | ------ | ---- |
  | name | `string | Array<string>` | `[]` | 权限组件对应的字段 |

### directive

- **类型:** `Directive`

- **指令表达式的类型:** `string | Array`

- **用法:**

  通过以指令方式来控制按钮是否有权限显示

  ```vue
  <!-- 使用字符类型控制按钮显示 -->
  <button v-permission="'sys.export'">导出</button>
  
  <!-- 对于需要多个权限控制显示的可使用数组的数据类型 -->
  <button v-permission="['sys.export', 'sys.delete']">导出</button>
  ```

### hasPermission(key)

- **类型:** `Function`

- **参数:** `{string} key`

- **返回值:** `{boolean}`

- **用法:**

  `hasPermission` 方法可用于判断权限映射中对应 `key` 是否具有权限

  ```js
  hasPermission('sys:export') // true
  ```

### setPermission(keyOrObj, [value])

- **类型:** `Function`

- **参数:**
  - `{string | Object} keyOrObj`
  - `{boolean} value`

- **用法:**

`setPermission` 方法用于设置权限映射中对应 `key` 的值

```js
// 设置单个 key
setPermission('sys.export', true)
// 以对象格式设置多个 key
setPermission({
  'sys.export': true,
  'sys.delete': true,
  'sys.edit': true,
})
```

### watchPermission(key, callback)

- **类型:** `Function`

- **参数:**
  - `{string} key`
  - `{Function} callback`

- **返回值:** `{Function} unwatch`

- **用法:**

  `watchPermission` 方法可用于监听某个 `key` 的变化，并执行回调。

  同时该方法返回一个取消观察函数，可用来取消监听，取消回调

  ```js
  const unwatch = watchPermission('sys.export', (val) => {})
  // 调用 unwatch 函数停止观察
  unwatch()
  ```
