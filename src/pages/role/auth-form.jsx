import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import {
  Form,
  Table,
  Tree,
  Input
} from 'antd'
import menuList from '../../config/menuConfig'


/* 设置角色权限的组件 */
export default class AuthForm extends Component {

  // static propTypes = {
  //   role: PropTypes.object
  // }

  constructor(props) {
    super(props)

    // 根据传入角色的menus生成初始状态
    const { menus } = this.props.role
    this.state = {
      treeData: [],
      checkedKeys: menus.split(',')
    }
  }

  /* 选中某个treeNode时的回调 */
  onCheck = (checkedKeys, info) => {
    this.setState({ checkedKeys })
  };

  /* 为父组件提供获取最新menus数据的方法 */
  getMenus = () => {
    return this.state.checkedKeys.join(',')
  }

  UNSAFE_componentWillMount() {
    const treeData = [
      {
        title: '平台权限',
        key: 'all',
        children: menuList
      }
    ]
    this.setState({ treeData })
  }

  // 根据新传入的role来更新checkedKeys的状态
  /* 当组件接收到新得属性时自动调用，在render之前调用 */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus.split(',')
    })
    // this.state.checkedKeys = menus.split(',')
  }

  render() {
    const { role } = this.props
    const { treeData, checkedKeys } = this.state
    // console.log(role.name);
    console.log('authForm');
    return (
      <Form initialValues={{ roleName: role.name }}>
        <Form.Item
          name='roleName'
          label='角色名称'
          rules={[
            { required: true, whitespace: true, message: '角色名称必须输入' },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <Tree
          checkable
          defaultExpandAll={true}
          treeData={treeData}
          // defaultCheckedKeys={checkedKeys}
          checkedKeys={checkedKeys}
          onCheck={this.onCheck}
        />
      </Form>
    )
  }
}
