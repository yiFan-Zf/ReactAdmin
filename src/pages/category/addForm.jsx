import React, { Component } from 'react'
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types'
import { nanoid } from 'nanoid'



const { Option } = Select;
/* 添加分类的Form组件 */
export default class AddForm extends Component {

  static propTypes = {
    categorys: PropTypes.array.isRequired,//一级分类的数组
    // parentId: PropTypes.string.isRequired,//父分类的ID
  }

  formRef2 = React.createRef()

  componentDidMount() {
    this.props.setForm(this.formRef2.current)
  }



  render() {
    const { categorys, parentId } = this.props
    return (
      <Form ref={this.formRef2} initialValues={{ parentId: parentId }}>
        <Form.Item name='parentId'>
          <Select key={nanoid()}>
            <Option value='0'>一级分类</Option>
            {
              categorys.map(c => {
                return (<Option value={c.id} key={c.id}>{c.name}</Option>)
              })
            }
          </Select>
        </Form.Item>
        <Form.Item name='name'
          rules={[
            { required: true, whitespace: true, message: '分类名称必须输入' },
          ]}
        >
          <Input placeholder='请输入分类名称' key={nanoid()} />
        </Form.Item>
      </Form>
    )
  }
}
