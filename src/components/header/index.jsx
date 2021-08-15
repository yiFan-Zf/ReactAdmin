import React, { Component } from 'react'
import { Button, Modal } from 'antd';
import { withRouter } from 'react-router-dom'
import { QuestionCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';

import './index.less'
import { reqWeather } from '../../api'
import { formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import menuList from '../../config/menuConfig'
import storageUtils from '../../utils/storageUtils'


class Header extends Component {

  state = {
    currentTime: formateDate(Date.now()),//当前时间的字符串
    weather: '',//天气的文本
    city: '',//当前城市
  }

  getTime = () => {
    this.intervalId = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({ currentTime })
    }, 1000)
  }

  // 获取当前天气
  getWeather = async () => {
    let result = await reqWeather()
    const weather = result.lives[0].weather
    const city = result.lives[0].city
    this.setState({ weather, city })
  }

  // 获取当前路径所对的title
  getTitle = () => {
    // 达到当前请求路径
    const path = this.props.location.pathname
    let title

    menuList.forEach(item => {
      if (item.key === path) {
        title = item.title
      } else if (item.children) {
        // 在所有子item中查找匹配项
        const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
        // 如果有值才说明有匹配的
        if (cItem) {
          title = cItem.title
        }
      }
    })
    return title
  }

  /* 
  退出登录
  */
  logout = () => {
    Modal.confirm({
      icon: <QuestionCircleOutlined />,
      content: '确定退出吗？',
      onOk: () => {
        //删除保存的user数据
        memoryUtils.user = {}
        // 删除本地存储的用户信息
        storageUtils.removeUser()
        // 跳转到login
        this.props.history.replace('/login')
      }
    });
  }

  /* 
  第一次render()之后执行，
  一般在此执行异步请求，发ajax请求/开启定时器
  */
  componentDidMount() {
    this.getTime();
    this.getWeather()
  }

  /* 当前组件卸载之前调用 */
  componentWillUnmount() {
    clearInterval(this.intervalId)
  }

  render() {
    const title = this.getTitle()

    const { currentTime, weather, city } = this.state
    const user = memoryUtils.user.name
    return (
      <div className='header'>
        <div className='header-top'>
          <span>欢迎，{user}</span>
          {/* <a href="javascript:;">退出</a> */}
          <Button type="link" onClick={this.logout}>退出</Button>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>
            {title}
          </div>
          <div className='header-bottom-right'>
            <span>{currentTime}</span>
            <span className='city'><EnvironmentOutlined />{city}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)