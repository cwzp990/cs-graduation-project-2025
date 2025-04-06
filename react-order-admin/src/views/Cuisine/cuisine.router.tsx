import { TagOutlined } from '@ant-design/icons'
import { AdminRouterItem } from '../../router'
import CuisineManagementPage from '.'

const dishesRoutes: AdminRouterItem[] = [
  {
    path: 'cuisine-manager',
    element: <CuisineManagementPage />,
    meta: {
      label: "菜系管理",
      title: "菜系管理",
      key: "/cuisine-manager",
      icon: <TagOutlined />,
    },
    sort: 3,
  },
]

export default dishesRoutes
