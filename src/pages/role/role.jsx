import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'

import { reqRoles, reqCreateRole, reqUpdateRole } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
import AddForm from './add-form'
import AuthForm from './auth-form'

import { formatDateByString, formateDate } from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'


/* 
角色路由
*/
export default class Role extends Component {

  state = {
    roles: [],//所有角色的数组
    role: [],//选中的role
    isShowAdd: false,//是否显示添加角色
    isShowRoleAuth: false,//是否显示设置角色权限界面
  }

  auth = React.createRef()

  initColumn = () => {
    this.columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '创建时间',
        dataIndex: 'createTime'
      },
      {
        title: '授权时间',
        dataIndex: 'authTime'
      },
      {
        title: '授权人',
        dataIndex: 'authName'
      },
    ]
  }

  /* 获取所有角色 */
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({ roles })
    }
  }

  /* 点击行的回调 */
  onRow = (role) => {
    return {
      onClick: event => { // 点击行this.setState()
        this.setState({ role })
        // console.log('点击了行', role, event);
      }
    }
  }

  /* 添加角色 */
  addRole = () => {
    console.log(this.form);
    this.form.validateFields().then(async (values) => {
      this.setState({ isShowAdd: false })
      this.form.resetFields()

      // 收集输入数据
      const { roleName } = values
      const role = {
        name: roleName,
        createTime: formatDateByString(new Date(), 'yyyy-MM-dd hh:mm:ss'),
      }

      // 请求添加
      const result = await reqCreateRole(role)
      console.log(result);
      if (result.state === 'success') {
        // 根据结果提示/更新列表显示
        message.success('添加角色成功')
        // this.getRoles()
        // 新产生的角色
        const role = result.data
        // this.setState({ roles: [...this.state.roles, role] })
        // 更新roles状态：基于原本状态数据更新
        this.setState(state => ({
          roles: [...state.roles, role]
        }))
      }
    }).catch((err) => {
      message.warning('添加角色失败')
    })
  }

  /* 更新角色权限 */
  updateRole = async () => {
    this.setState({ isShowRoleAuth: false })
    const role = this.state.role
    // 得到最新的menus
    const menus = this.auth.current.getMenus()
    role.menus = menus
    // 获取授权人
    role.authName = memoryUtils.user.name
    // 获取授权时间
    // role.authTime = formateDate(new Date());
    role.authTime = formatDateByString(new Date(), 'yyyy-MM-dd hh:mm:ss');

    // 发送更新角色权限的请求
    const result = await reqUpdateRole(role.id, role)
    console.log(result);
    if (result === 'success') {
      // message.success('设置角色权限成功')
      // this.getRoles()
      // 如果当前更新的是自己的权限，强制退出
      if (role.id === memoryUtils.user.roleId) {
        memoryUtils.user = {}
        storageUtils.removeUser()
        this.props.history.replace('/login')
        message.success('当前角色权限修改了，请重新登录')
      } else {
        message.success('设置角色权限成功')
        this.setState({ roles: [...this.state.roles] })
      }
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumn()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const { roles, role, isShowAdd, isShowRoleAuth } = this.state

    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>&nbsp;&nbsp;
        <Button type='primary' disabled={!role.id} onClick={() => this.setState({ isShowRoleAuth: true })}>设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          rowKey='id'
          bordered
          dataSource={roles}
          columns={this.columns}
          pagination={{
            defaultPageSize: PAGE_SIZE,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [role.id],
            onSelect: (role) => {//选择某个radio时回调
              this.setState({ role })
            }
          }}
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false })
          }}
        >
          <AddForm
            setForm={form => this.form = form}
          />
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowRoleAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowRoleAuth: false })
          }}
        >
          <AuthForm role={role} ref={this.auth} />
        </Modal>
      </Card>
    )
  }
}
