import React, { Component } from 'react'
import { Form, Input } from 'antd'
// import PropTypes from 'prop-types'


/* 添加分类的Form组件 */
export default class UpdateForm extends Component {
  // static propTypes = {
  //   categoryName: PropTypes.string.isRequired,
  //   setForm: PropTypes.func.isRequired
  // }

  componentDidMount() {
    // console.log(this.formRef.current);
    this.props.setForm(this.formRef.current)
  }


  formRef = React.createRef()

  render() {
    const { name, id } = this.props.categoryName
    console.log('---------name', name);
    console.log('---------id', id);
    return (
      <Form ref={this.formRef} initialValues={{ name: name }} key={id}>
        <Form.Item name='name'
          rules={[
            { required: true, whitespace: true, message: '分类名称必须输入' },
          ]}
        >
          <Input placeholder='请输入分类名称' allowClear />
        </Form.Item>
      </Form>
    )
  }
}
