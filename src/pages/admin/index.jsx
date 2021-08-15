import React, { Component } from 'react'
// import { Redirect } from 'react-router-dom'
import { Layout } from 'antd';
import { Route, Switch, Redirect } from 'react-router-dom'

import memory from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'


const { Footer, Sider, Content } = Layout;


export default class Admin extends Component {

  componentDidMount() {
    const user = memory.user
    // 如果内存中没有存储user==>当前没有登陆
    if (!user || !user.id) {
      // 自动跳转到登录界面
      this.props.history.replace('/login')
      // return <Redirect to='/login' />
    }
  }
  render() {
    // const user = memory.user

    return (
      <>
        <Layout style={{ minHeight: '100%' }}>
          <Sider>
            <LeftNav />
          </Sider>
          <Layout>
            <Header></Header>
            <Content style={{ margin: 20, backgroundColor: '#fff' }}>
              <Switch>
                <Route path='/home' component={Home} />
                <Route path='/category' component={Category} />
                <Route path='/product' component={Product} />
                <Route path='/role' component={Role} />
                <Route path='/user' component={User} />
                <Route path='/charts/bar' component={Bar} />
                <Route path='/charts/line' component={Line} />
                <Route path='/charts/pie' component={Pie} />
                <Redirect to='/home' />
              </Switch>
            </Content>
            <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
          </Layout>
        </Layout>
      </>
    )
  }
}
