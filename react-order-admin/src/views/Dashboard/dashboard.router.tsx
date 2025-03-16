import { DashboardOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import Home from '.'

const systemRoutes: AdminRouterItem[] = [
  {
    path: 'home',
    element: <Home />,
    meta: {
      label: "首页",
      title: "首页",
      key: "/home",
      icon: <DashboardOutlined />,
    },
    sort: 1,
  },
]

export default systemRoutes
