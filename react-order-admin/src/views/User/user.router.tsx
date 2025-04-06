import { TeamOutlined } from '@ant-design/icons';
import { AdminRouterItem } from '../../router'
import UserManagement from '.'

const userRoutes: AdminRouterItem[] = [
  {
    path: 'user-manager',
    element: <UserManagement />,
    meta: {
      label: "人员管理",
      title: "人员管理",
      key: "/user-manager",
      icon: <TeamOutlined />,
    },
    sort: 7,
  },
]

export default userRoutes
