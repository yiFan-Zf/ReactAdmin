import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';
import * as Icon from "@ant-design/icons";
// import {
//   QrcodeOutlined,
//   HomeOutlined,
//   BarsOutlined,
//   PartitionOutlined,
//   UserOutlined,
//   SafetyOutlined,
//   AreaChartOutlined,
//   BarChartOutlined,
//   LineChartOutlined,
//   PieChartOutlined
// } from '@ant-design/icons';

import './index.less'
import login from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'
import { reqRoles } from '../../api'


const { SubMenu } = Menu;

/* 
左侧导航的组件
*/
class LeftNav extends Component {

  state = {
    menus: []
  }

  // 判断当前登录用户对item是否有权限
  hasAuth = (item) => {

    const { key, isPublic } = item
    // const menu = memoryUtils.user.role.menus
    const menus = this.state.menus

    const name = memoryUtils.user.name
    /* 
    1.如国当前用户是admin
    2.如果当前item是公开的
    3.当前用户有此item的权限：key有没有在menus中
    */
    if (name === 'admin' || isPublic || menus.indexOf(key) !== -1) {
      return true
    } else if (item.children) {// 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  // 获取roleID所对应的权限
  getRoleAuth = async (roleId) => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      const role = roles.find((role) => {
        return role.id === roleId * 1
      })
      const menus = role.menus.split(',')
      this.setState({ menus })
    }
  }


  /* 
  根据menu的数组生成对应的标签数组
  使用map()+递归调用
  */
  getMenuNodes_map = (menuList) => {
    return menuList.map((item) => {

      if (!item.children) {
        //antd4中动态创建icon
        const icon = React.createElement(
          Icon[item.icon],
          {
            style: { fontSize: '16px' }
          }
        )
        return (
          <Menu.Item key={item.key} icon={icon}>
            <Link to={item.key}> {item.title}</Link>
          </Menu.Item>
        )
      } else {
        const icon = React.createElement(
          Icon[item.icon],
          {
            style: { fontSize: '16px' }
          }
        )
        return (
          <SubMenu key={item.key} icon={icon} title={item.title}>
            {
              this.getMenuNodes(item.children)
            }
          </SubMenu>
        )
      }
    })
  }

  /* 
  根据menu的数组生成对应的标签数组
  使用reduce()+递归调用
  */
  getMenuNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      // 向pre中添加Menu.Item
      // 如果当前用户有item对应的权限，才需要显示对应的菜单项
      if (this.hasAuth(item)) {
        if (!item.children) {
          const icon = React.createElement(
            Icon[item.icon],
            {
              style: { fontSize: '16px' }
            }
          )
          pre.push((
            <Menu.Item key={item.key} icon={icon}>
              <Link to={item.key}> {item.title}</Link>
            </Menu.Item>
          ))
        } else {
          //向pre添加SubMenu

          //得到当前请求的路由路径
          const path = this.props.location.pathname
          // 查找一个与当前请求路径匹配的子Item
          const CItem = item.children.find((cItem) => path.indexOf(cItem.key) === 0)
          //如果存在，说明当前item的子列表需要打开
          if (CItem) {
            this.openKey = item.key
          }

          const icon = React.createElement(
            Icon[item.icon],
            {
              style: { fontSize: '16px' }
            }
          )
          pre.push((
            <SubMenu key={item.key} icon={icon} title={item.title}>
              {
                this.getMenuNodes(item.children)
              }
            </SubMenu>
          ))
        }
      }

      return pre
    }, [])
  }

  /* 
    在第一次render()之前执行一次
    为第一次render()准备数据（必须是同步的）
   */
  UNSAFE_componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
    // this.getRoleAuth(memoryUtils.user.roleId)

  }

  componentDidMount() {
    this.getRoleAuth(memoryUtils.user.roleId)
  }

  render() {
    console.log(memoryUtils.user);
    // console.log(this.state.menus);
    //得到当前请求的路由路径
    let path = this.props.location.pathname
    if (path.indexOf('/product') === 0) {//当前请求的是商品或其子路由界面
      path = '/product'
    }
    const openKey = this.openKey
    // console.log(path);
    return (
      <div className='left-nav'>
        <Link to='/' className='left-nav-header'>
          <img src={login} alt="login" />
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {/* <Menu.Item key="/home" icon={<HomeOutlined />}>
            <Link to='/home'> 首页</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<QrcodeOutlined />} title="商品">
            <Menu.Item key="/category" icon={<BarsOutlined />}><Link to='/category'>品类管理</Link></Menu.Item>
            <Menu.Item key="/product" icon={<PartitionOutlined />}><Link to='/product'>商品管理</Link></Menu.Item>
          </SubMenu>
          <Menu.Item key="/user" icon={<UserOutlined />}>
            <Link to='/user'> 用户管理</Link>
          </Menu.Item>
          <Menu.Item key="/role" icon={<SafetyOutlined />}>
            <Link to='/role'> 角色管理</Link>
          </Menu.Item>
          <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形列表">
            <Menu.Item key="/bar" icon={<BarChartOutlined />}><Link to='/charts/bar'>柱状图</Link></Menu.Item>
            <Menu.Item key="/line" icon={<LineChartOutlined />}><Link to='/charts/line'>折线图</Link></Menu.Item>
            <Menu.Item key="/pie" icon={<PieChartOutlined />}><Link to='/charts/pie'>饼图</Link></Menu.Item>
          </SubMenu> */}
          {
            this.menuNodes
          }
        </Menu>
      </div>

    )
  }
}

/* 
withRouter是一个高阶组件
包装费路由组件，返回一个新得组件
新得组件向非路由组件传递三个属性：history、location、match

*/
export default withRouter(LeftNav)
