import React, { Component } from 'react'
import { Card, Button, Table, Select, Input, message } from 'antd';
import { PlusOutlined, } from '@ant-design/icons'

import { reqProducts, reqProductsByDesc, reqProductsByName, reqUpdateStatus } from '../../api'
import { PAGE_SIZE } from '../../utils/constants'
const { Option } = Select;


/* 
Product的默认子路由组件
*/
export default class ProductHome extends Component {

  state = {
    total: 0,//商品的总数量
    products: [],//商品的数组
    loading: false,//是否显示Loading
    searchInfo: '',//搜索的关键信息
    searchType: 'searchByName',
  }

  /* 初始化table中的列的数组 */
  initColumns = () => {
    this.columns = [
      {
        width: 150,
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        width: 100,
        title: '商品价格',
        dataIndex: 'price',
        render: (price) => '￥' + price//当前指定了对应的属性，传入的是对应的属性值
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: (product) => {
          const { id, status } = product
          return (
            <span>
              <Button
                type='primary'
                onClick={() => this.updateStatus(id, status === 1 ? 2 : 1)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
              <span>{status === 1 ? '在售' : '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              {/* 将product对象使用state传递给目标路由组件 */}
              <Button type='link' onClick={() => this.props.history.push('/product/detail', { product })}>详情</Button>
              <Button type='link' onClick={() => this.props.history.push('/product/addupdate', product)}>修改</Button>
            </span>
          )
        }
      },
    ];

  }

  /* 获取指定页码的列表数据显示 */
  getProducts = async (pageNum) => {

    this.pageNum = pageNum//保存pageNum，让其他方法可以用到当前页码

    this.setState({ loading: true })//显示loading

    const { searchInfo, searchType } = this.state
    // 如果搜索输入框有值，说明我们要做搜索分页
    let result
    if (searchInfo) {
      if (searchType === 'searchByName') {
        result = await reqProductsByName(searchInfo, pageNum, PAGE_SIZE)
      } else {
        result = await reqProductsByDesc(searchInfo, pageNum, PAGE_SIZE)
      }
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({ loading: false })//隐藏loading
    // console.log(result);
    // 取出分页数据，更新列表，显示数据
    const { total, list } = result
    this.setState({ total, products: list })
  }


  /* 更新指定商品的状态 */
  updateStatus = async (id, status) => {
    const result = await reqUpdateStatus(id, status)
    if (result === 1) {
      message.success('更新商品状态成功')
      this.getProducts(this.pageNum);
    }
  }

  UNSAFE_componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getProducts(1)
  }

  render() {

    const { products, total, loading, searchType, searchInfo } = this.state



    const title = (
      <span>
        <Select
          defaultValue={searchType}
          style={{ width: 150 }}
          onChange={value => this.setState({ searchType: value })}
        >
          <Option value='searchByName'>按名称搜索</Option>
          <Option value='searchByDesc'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='请输入关键字'
          style={{ width: 150, margin: '0 15px' }}
          value={searchInfo}
          onChange={e => this.setState({ searchInfo: e.target.value })}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )

    const extra = (
      <Button type="primary" icon={<PlusOutlined />} onClick={() => this.props.history.push('/product/addupdate')} >添加商品</Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
          rowKey='id'
          loading={loading}
          bordered
          dataSource={products}
          columns={this.columns}
          pagination={{
            current: this.pageNum,
            total,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.getProducts
          }}
        />
      </Card>
    )
  }
}
