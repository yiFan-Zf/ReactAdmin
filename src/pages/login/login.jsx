import React, { Component } from 'react'
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import login from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memory from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

export default class Login extends Component {

  componentDidMount() {
    // 如果用户已经登陆，就跳转到管理页面
    const user = memory.user
    if (user && user.id) {
      this.props.history.replace('/')
    }
  }


  onFinish = async (values) => {
    const { name, password } = values
    const result = await reqLogin(name, password)
    // console.log('请求成功', response.data);
    if (result.status === 0) {//登录成功
      message.success('登录成功')

      //保存user
      const user = result.data
      memory.user = user//保存在内存中
      storageUtils.saveUser(user)//保存到local中

      //跳转到管理界面(不需要回退回来，多以用replace)
      this.props.history.replace('/')
    } else {//登录失败
      message.error('用户名或密码不正确')
    }
    // try {
    //   const response = await reqLogin(name, password)
    //   console.log('请求成功', response.data);
    // } catch (error) {
    //   console.log('请求出错', error);
    // }
    // console.log('Received values of form: ', values);
  };

  // 对密码进行自定义验证
  validatorPsw = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('请输入密码'))
    } else if (value.length < 2) {
      return Promise.reject(new Error('密码不能小于2位'))
    } else if (value.length > 12) {
      return Promise.reject(new Error('密码不能大于12位'))
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return Promise.reject(new Error('密码必须是英文、数字或下划线组成'))
    } else {
      return Promise.resolve()
    }
  };

  render() {

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={login} alt="login" />
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish}
          >
            <Form.Item
              name="name"
              //声明式验证，直接使用别人定义好的验证规则进行验证
              rules={[
                { required: true, whitespace: true, message: '请输入用户名!' },
                { min: 4, message: '用户名至少4位' },
                { max: 12, message: '用户名最多12位' },
                { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' }
              ]}
              initialValue='admin'//指定默认初始值
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  validator: this.validatorPsw
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
               </Button>
            </Form.Item>
          </Form>
        </section>
      </div >
    )
  }
}
