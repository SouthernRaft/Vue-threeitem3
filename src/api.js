// 统一数据请求层
// 开发环境（npm run dev + json-server）走真实 axios 请求；
// 生产环境（GitHub Pages 静态部署，没有 json-server）改为读取打包进来的 game.json，
// 在前端模拟 json-server 的取数行为，这样纯静态托管也能正常显示数据。
import axios from 'axios'
import staticDb from '../game.json'

const API = 'http://localhost:3003'

// 模拟 json-server：支持 /games、/games/1（取单条）、/reviews?gameId=1（按查询参数过滤）
function queryStatic(url) {
  const path = url.replace(API, '')
  const [resourcePart, queryStr] = path.split('?')
  const segments = resourcePart.split('/').filter(Boolean) // 例如 ['games', '1']
  const resource = segments[0]
  const id = segments[1]
  let list = staticDb[resource] || []

  // 处理 ?gameId=1 这类查询参数过滤
  if (queryStr) {
    const params = new URLSearchParams(queryStr)
    for (const [key, value] of params) {
      list = list.filter((item) => String(item[key]) === String(value))
    }
  }

  // 带 id 时取单条，否则返回整个列表
  const data = id !== undefined ? list.find((item) => String(item.id) === String(id)) : list
  return { data }
}

// 对外暴露与 axios 相同的 get 方法，页面里 axios.get(...) 无需改动
export default {
  get(path) {
    const url = path.startsWith('http') ? path : API + path
    if (import.meta.env.PROD) {
      // 生产环境：从静态 game.json 取数
      return Promise.resolve(queryStatic(url))
    }
    // 开发环境：真实请求 json-server
    return axios.get(url)
  },
}
