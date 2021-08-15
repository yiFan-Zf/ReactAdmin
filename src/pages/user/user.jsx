import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  Space,
  message
} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { reqUsers, reqRoles, reqDeleteUser, reqAddUser, reqUpdateUser } from '../../api'
import UserForm from './user-form'

const { confirm } = Modal;

/* 
用户路由
*/
export default class User extends Component {

  state = {
    roles: [],//所有角色的列表
    users: [],//所有用户列表
    isShow: false,//是否显示Modal
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'phone',
      },
      {
        title: '注册时间',
        dataIndex: 'createTime',
      },
      {
        title: '所属角色',
        dataIndex: 'roleId',
        render: (roleId) => this.roleNames[roleId]
      },
      {
        title: '操作',
        render: (user) => (
          <Space size="middle">
            <Button type="link" onClick={() => this.showUpdate(user)}>修改</Button>
            <Button type="link" onClick={() => this.deleteUser(user)} >删除</Button>
          </Space>
        )
      },
    ]
  }

  /* 根据role的数组，生成包含所有角色名的对象（属性名用角色id值） */
  initRoleNames = (roles) => {
    const roleNames = roles.reduce((pre, role) => {
      pre[role.id] = role.name
      return pre
    }, {})
    // 保存
    this.roleNames = roleNames

  }

  /* 显示修改界面 */
  showUpdate = (user) => {
    this.user = user//保存user
    this.setState({ isShow: true })
  }

  /* 显示创建用户界面 */
  showAdd = () => {
    this.user = null//去除前面保存的user
    this.setState({ isShow: true })
  }

  /* 删除指定用户 */
  deleteUser = (user) => {
    confirm({
      title: `确认删除${user.name}吗?`,
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        const result = await reqDeleteUser(user.id)
        if (result === 'success') {
          message.success('删除用户成功')
          this.getUsers()
        }
      },
    });

  }


  /* 添加或更新用户 */
  addOrUpdateUser = async () => {
    // this.setState({ isShow: false })
    // 收集输入数据
    const user = this.form.getFieldsValue()
    this.form.resetFields()
    let result
    // 提交添加的请求
    if (this.user) {//更新用户
      user.id = this.user.id
      result = await reqUpdateUser(user)
    } else {//添加用户
      result = await reqAddUser(user)
    }
    if (result === 'success') {
      message.success(`${this.user ? '修改' : '添加'}用户成功`);
      this.getUsers()
    } else {
      message.error(`${this.user ? '修改' : '添加'}用户失败`);
    }

    // 更新列表显示
  }

  onCancel = () => {
    this.form.resetFields()
    this.setState({ isShow: false })
  }

  getUsers = async () => {
    const users = await reqUsers()
    const roles = (await reqRoles()).data
    this.initRoleNames(roles)
    this.setState({ users, roles })
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const { users, isShow, roles } = this.state
    const user = this.user || {}
    const title = <Button type='primary' onClick={this.showAdd}>创建用户</Button>
    return (
      <Card title={title}>
        <Table
          dataSource={users}
          columns={this.columns}
          bordered
          rowKey='id'
          pagination={{ defaultPageSize: 5 }}
        />
        <Modal
          title={user.id ? '修改用户' : '创建用户'}
          visible={isShow}
          onOk={this.addOrUpdateUser}
          onCancel={this.onCancel}
          destroyOnClose={true}
        >


          {/* <AddForm categorys={categorys} parentId={parentId} setForm={form => this.form = form} /> */}
          <UserForm
            setForm={form => this.form = form}
            roles={roles}
            user={user}
          />
        </Modal>
      </Card>
    )
  }
}
