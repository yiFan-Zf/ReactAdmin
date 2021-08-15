import React, { Component } from 'react'
import { Form, Input, } from 'antd';
// import PropTypes from 'prop-types'
// import { nanoid } from 'nanoid'



/* 添加分类的Form组件 */
export default class AddForm extends Component {


  formRef = React.createRef()

  componentDidMount() {
    this.props.setForm(this.formRef.current)
  }



  render() {
    return (
      <Form ref={this.formRef} >
        <Form.Item
          name='roleName'
          label='角色名称'
          rules={[
            { required: true, whitespace: true, message: '角色名称必须输入' },
          ]}
        >
          <Input placeholder='请输入角色名称' />
        </Form.Item>
      </Form>
    )
  }
}
