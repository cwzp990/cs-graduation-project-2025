import { TeamOutlined } from '@ant-design/icons';
import { AdminRouterItem } from '../../router'
import UserManagement from '.'

const userRoutes: AdminRouterItem[] = [
  {
    path: 'user-manager',
    element: <UserManagement />,
    meta: {
      label: "系统管理",
      title: "系统管理",
      key: "/user-manager",
      icon: <TeamOutlined />,
    },
    sort: 6,
  },
]

export default userRoutes
