import React, { Component } from 'react'
import { Card, Button, Space, Table, message, Modal } from 'antd';
import { PlusOutlined, ArrowRightOutlined } from '@ant-design/icons'

import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api'
import AddForm from './addForm'
import UpdateForm from './updateForm'

/* 
商品分类路由
*/
// eslint-disable-next-line
export default class Category extends Component {

  state = {
    loading: false,//是否正在获取数据中
    categorys: [],//一级分类列表
    subCategorys: [],//二级分类列表
    parentId: '0',//当前需要显示的分类列表的父分类Id
    parentName: '',//当前需要显示的分类列表的父分类名称
    showStatus: 0,//标识添加/更新的确认框是否显示,0:都不显示,1:显示添加,2:显示更新
  }

  /* 初始化table所有列的数组 */
  initColumns = () => {
    this.columns = [
      {
        title: '分类的名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        key: 'action',
        width: 300,
        render: (category) => (
          <Space size="middle">
            <Button type="link" onClick={() => this.showUpdate(category)}>修改分类</Button>
            {
              this.state.parentId === '0' ? <Button type="link" onClick={this.showSubCategorys(category)}>查看子分类</Button> : null
            }
          </Space>
        ),
      },
    ]
  }



  /* 
  异步获取一级/二级分类列表显示 
  parentId：如果没有指定就根据状态中的parentId请求，如果指定了根据指定的
  */
  getCategorys = async (parentId) => {

    // 发请求前显示loading
    this.setState({ loading: true })
    parentId = parentId || this.state.parentId
    // 发异步ajax请求,获取数据
    const result = await reqCategorys(parentId)
    // 在请求完成后,隐藏loading
    this.setState({ loading: false })

    if (result.status === 0) {
      // 取出分类数组(可能是一级的也可能是二级的)
      const categorys = result.data
      // console.log(categorys);
      if (parentId === '0') {
        // 更新一级分类状态
        this.setState({ categorys })
      } else {
        // 更新二级分类状态
        this.setState({ subCategorys: categorys })
      }
    } else {
      message.error('获取分类列表失败');
    }
    // console.log(result);
  }

  /* 显示子指定一级分类对象的二级子列表 */
  showSubCategorys = (category) => {
    return () => {
      // 更新状态
      // console.log(category);
      this.setState({ parentId: category.id, parentName: category.name }, () => {
        //在状态更新且重新render()后执行
        this.getCategorys()
        // console.log(this.state.parentId);
      })
    }


  }

  /* 显示一级分类列表 */
  showCategorys = () => {
    // 更新为显示一级列表的状态
    this.setState({
      parentId: '0',
      parentName: '',
      subCategorys: []
    })
  }

  /* 响应点击取消:隐藏确认框 */
  handleCancel = () => {
    //清除输入数据
    // this.form.resetFields()
    // 隐藏确认框
    this.setState({ showStatus: 0 })
  }

  /* 显示添加的确认框 */
  showAdd = () => {
    this.setState({ showStatus: 1 })
  }

  /* 添加分类 */
  addCategory = () => {
    console.log('表单正在验证');

    // 1.隐藏确认框
    this.form.validateFields().then(async (values) => {
      console.log('表单输入验证通过');
      this.setState({ showStatus: 0 })
      // 2.添加分类，并提交添加分类的请求
      console.log(values);
      // const categorys = this.state.categorys
      const parentId = values.parentId
      const name = values.name
      // const categoryName = parentId === '0' ? '一级分类' : categorys[Number.parseInt(parentId) - 1].categoryName
      const categoryName = '新添加的测试分类'
      console.log('parentId', parentId);
      console.log('name', name);
      console.log('categoryName', categoryName);
      const result = await reqAddCategory(parentId, categoryName, name)
      if (result.status === 0) {
        // 添加的分类就是当前分类
        if (parentId === this.state.parentId) {
          // 3.重新获取当前分类列表显示
          this.getCategorys()
        } else if (parentId === '0') {//在二级分类列表下添加一级分类，重新获取一级分类列表，但是不需要显示一级列表
          this.getCategorys('0')
        }
      }
    }).catch((err) => {
      message.warning('请输入分类名称')
    })


  }

  /* 显示更新的确认框 */
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    console.log('@', category.name);
    this.setState({ showStatus: 2 })
  }

  /* 更新分类 */
  updataCategory = () => {

    this.form.validateFields().then(async (values) => {
      //1. 隐藏确认框
      this.setState({ showStatus: 0 })
      // 2.发请求更新分类

      // console.log(values);
      const parentId = this.category.id
      const id = this.category.id
      const categoryName = this.category.categoryName
      const name = values.name
      // console.log(this.form);
      //清除输入数据
      // this.form.resetFields()
      const result = await reqUpdateCategory(id, parentId, name, categoryName)
      if (result.status === 0) {
        // 3.重新显示列表
        this.getCategorys()
      }
    }).catch((err) => {
      message.warning('请输入分类名称')
    })
  }

  /* 为第一次render()准备数据 */
  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  /* 执行异步任务,发送ajax请求 */
  componentDidMount() {
    // 获取一级分类列表
    this.getCategorys()
  }

  render() {
    // 读取状态数据
    const { categorys, loading, parentId, subCategorys, parentName, showStatus } = this.state
    // 读取指定的分类
    const category = this.category || {}//如果还没有,指定一个空对象
    // card的左侧标题内容
    const title = parentId === '0' ? '一级分类列表' : (
      <span>
        <Button type="link" style={{ color: 'black' }} onClick={this.showCategorys}>一级分类列表</Button>
        <ArrowRightOutlined />
        <Button type="link">{parentName}</Button>
      </span>
    )
    const extra = (
      <Button type="primary" icon={<PlusOutlined />} onClick={this.showAdd}>More</Button>
    )
    return (
      <>
        {/* <Card title="Default size card" extra={<Button type="link" >More</Button> {{ width: 300 }}> */}
        < Card title={title} extra={extra} >
          <Table dataSource={parentId === '0' ? categorys : subCategorys} columns={this.columns} bordered rowKey='id' pagination={{ defaultPageSize: 5, showQuickJumper: true }} loading={loading} />
          <Modal title="添加分类" visible={showStatus === 1} onOk={this.addCategory} onCancel={this.handleCancel}>
            <AddForm categorys={categorys} parentId={parentId} setForm={form => this.form = form} />
          </Modal>
          <Modal title="更新分类" visible={showStatus === 2} onOk={this.updataCategory} onCancel={this.handleCancel}>
            <UpdateForm categoryName={category} setForm={form => this.form = form} />
          </Modal>
        </Card >
      </>
    )
  }
}
