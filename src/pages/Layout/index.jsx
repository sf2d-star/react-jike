import { Layout, Menu, Popconfirm } from 'antd'
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { clearUserInfo, fetchUserInfo } from '@/store/modules/user'
import { useEffect } from 'react'

const { Header, Sider } = Layout

const items = [
  {
    label: 'Home',
    key: '/home',
    icon: <HomeOutlined />,
  },
  {
    label: 'Manage Articles',
    key: '/article',
    icon: <DiffOutlined />,
  },
  {
    label: 'Create Article',
    key: '/publish',
    icon: <EditOutlined />,
  },
]

const GeekLayout = () => {
  const navigate = useNavigate()
  const onMenueClick = (route) => {
    //console.log('Menu is clicked.', route);
    const path = route.key
    navigate(path)
  }

  // 反向高亮
  //1. 获取当前路径
  const location = useLocation()
  //console.log(location.pathname);
  const selectedkey = location.pathname

  //触发个人用户信息action
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [dispatch])

  const name = useSelector(state => state.user.userInfo.name)
  //console.log('userInfo.name', name);

  //退出登陆确认回调
  const onConfirm = () => {
    //console.log('confirm logout');
    dispatch(clearUserInfo())
    navigate('/login')
  }

  return (
    <Layout>
      <Header className="header">
        <div className="logo" />
        <div className="user-info">
          <span className="user-name">{name}</span>
          <span className="user-logout">
            <Popconfirm title="Are you sure to log out？" okText="Yes" cancelText="Cancel" onConfirm={onConfirm}>
              <LogoutOutlined /> Logout
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            selectedKeys={selectedkey}
            onClick={onMenueClick}
            items={items}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          {/* 二级路由出口 */}
          <Outlet />
        </Layout>
      </Layout>
    </Layout>
    )
}

export default GeekLayout
