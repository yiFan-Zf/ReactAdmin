import React, { PureComponent } from 'react'
import {
  Form,
  Input,
  Select
} from 'antd';
import PropTypes from 'prop-types'

const { Option } = Select

/* 添加/修改的Form组件 */
export default class UserForm extends PureComponent {

  static propTypes = {
    roles: PropTypes.array.isRequired
  }


  formRef = React.createRef()

  componentDidMount() {
    this.props.setForm(this.formRef.current)
  }

  render() {
    const { roles } = this.props
    const user = this.props.user
    const formItemLayout = {
      labelCol: { span: 3 },//左侧label的宽度
    }
    console.log(user);
    console.log(roles);

    return (
      <Form
        ref={this.formRef}
        {...formItemLayout}
        initialValues={{
          name: user.name,
          password: user.password,
          phone: user.phone,
          email: user.email,
          roleId: user.roleId ? user.roleId * 1 : ''
        }}
      >
        <Form.Item
          name='name'
          label='用户名'
        >
          <Input placeholder='请输入用户名' />
        </Form.Item>
        {
          user.id ? null : (
            <Form.Item
              name='password'
              label='密码'
            >
              <Input type='password' placeholder='请输入密码' />
            </Form.Item>
          )
        }
        <Form.Item
          name='phone'
          label='手机号'
        >
          <Input placeholder='请输入手机号' />
        </Form.Item>
        <Form.Item
          name='email'
          label='邮箱'
        >
          <Input placeholder='请输入邮箱' />
        </Form.Item>
        <Form.Item
          name='roleId'
          label='角色'
        >
          <Select>
            {
              roles.map((role) => {
                return <Option key={role.id} value={role.id}>{role.name}</Option>
              })
            }
          </Select>
        </Form.Item>
      </Form>
    )
  }
}
