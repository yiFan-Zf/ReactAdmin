import React, { Component } from 'react'
import {
  Card,
  Input,
  Table,
  Form,
  Cascader,
  Upload,
  Button,
  message
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { reqCategorys, reqAddProduct, reqUpdateProduct } from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'


const { TextArea } = Input;
const { Item } = Form



/* 
Product的添加和更新的子路由组件
*/
export default class ProductAddUpdate extends Component {

  state = {
    options: []
  }

  picturesWallRef = React.createRef();
  richTextEditorRef = React.createRef()

  /*  */
  initOptions = async (categorys) => {
    //根据categorys生成options数组
    const options = categorys.map(c => ({
      value: c.id,
      label: c.name,
      isLeaf: false,//不是叶子
    }))

    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this
    const { pcategoryId, categoryId, id } = product
    if (isUpdate && pcategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pcategoryId)
      // console.log(subCategorys);
      // 生成二级分类列表
      // const childOptions = subCategorys.map(c => ({
      //   value: c.id,
      //   label: c.name,
      //   isLeaf: false,//不是叶子
      // }))
      // // 找到当前商品对应的一级option对象
      // const targetOption = options.find(option => option.value === pcategoryId)
      // // 关联到对应的一级Option上
      // targetOption.childOptions = childOptions
    }
    // 更新options状态
    this.setState({ options })
  }


  /* 
  异步获取一级/二级分类列表，并显示
  async函数的返回值是一个Promise函数，promise函数的结果和值由async的结果决定
  */
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categotys = result.data
      // 如果是一级分类列表
      if (parentId === '0') {
        this.initOptions(categotys)
      } else {//二级类列表
        return categotys //返回二级列表 ==>当前promise就会进入成功且value为categotys
      }
    }
  }


  onFinish = async (values) => {

    // 1.收集数据,并封装成product对象
    const { name, desc, categoryIds, price } = values
    let pcategoryId, categoryId
    if (categoryIds.length === 1) {
      pcategoryId = '0'
      categoryId = categoryIds[0]
    } else {
      pcategoryId = categoryIds[0]
      categoryId = categoryIds[1]
    }
    let images = this.picturesWallRef.current.getImgs()
    images = images.join()
    const detail = this.richTextEditorRef.current.getDetail()

    const product = { name, desc, pcategoryId, categoryId, images, detail, price }
    let result
    //如果四更新，需要添加id
    if (this.isUpdate) {
      product.id = this.product.id
      // 2.调用接口请求函数去添加/更新
      result = await reqUpdateProduct(product.id, product);
    } else {//如果是新增
      product.status = 1
      product.v = 0
      // 2.调用接口请求函数去添加/更新
      result = await reqAddProduct(product);
    }

    // 3.根据结果提示
    if (result.status === 0) {
      message.success(`${this.isUpdate ? '更新' : '添加'}商品成功！`);
      this.props.history.goBack()
    } else {
      message.error(`${this.isUpdate ? '更新' : '添加'}商品失败！`);
    }
  }

  /* 验证价格的自定义验证函数 */
  validatorPrice = () => {
    return ({
      validator(_, value) {
        if (value * 1 > 0) {
          return Promise.resolve();
        }
        return Promise.reject(new Error('商品价格必须大于0'));
      },
    })
  }

  /* 
  用于加载下一级列表的回调函数
  */
  loadData = async selectedOptions => {
    //得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1]
    // 显示loading
    targetOption.loading = true
    // 根据选中的分类，获取二级列表
    const subCategorys = await this.getCategorys(targetOption.value)
    // 二级分类列表有值
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const cOptions = subCategorys.map(c => ({
        value: c.id,
        label: c.name,
        isLeaf: true,//不是叶子
      }))
      // 关联到当前option上
      targetOption.children = cOptions

    } else {//当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    targetOption.loading = false;

    // 更新options状态
    this.setState({
      options: [...this.state.options]
    })

  };

  componentDidMount() {
    this.getCategorys('0')
  }

  UNSAFE_componentWillMount() {
    const product = this.props.location.state
    // 保存是否是更新的标识    两次取反获得的是布尔值
    this.isUpdate = !!product
    this.product = product || {}
  }

  render() {
    const { isUpdate, product } = this
    const { pcategoryId, categoryId, images, detail } = product
    console.log(product);
    // 用来接收级联分类ID的数组
    const categoryIds = []
    if (pcategoryId === '0') {
      // 如果是一个一级分类列表
      categoryIds.push(categoryId * 1)
    } else {
      categoryIds.push(pcategoryId * 1)
      categoryIds.push(categoryId * 1)
    }
    const formItemLayout = {
      labelCol: { span: 2 },//左侧label的宽度
      wrapperCol: { span: 8, offset: 1 },//指定右侧包裹的宽度
    }

    const title = (
      <span>
        <Button type='link'> <ArrowLeftOutlined onClick={() => this.props.history.goBack()} /></Button>
        <span>{isUpdate ? '修改商品' : '添加商品'}</span>
      </span>
    )

    return (
      <Card title={title}>
        <Form
          {...formItemLayout}
          onFinish={this.onFinish}
          initialValues={{ name: product.name, desc: product.desc, price: product.price, categoryIds: categoryIds }}
        >
          <Item
            label='商品名称'
            name='name'
            rules={[{ required: true, whitespace: true, message: '必须输入商品名称' }]}
          >
            <Input placeholder='请输入商品名称' />
          </Item>
          <Item
            label='商品描述'
            name='desc'
            rules={[{ required: true, whitespace: true, message: '必须输入商品描述' }]}
          >
            <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
          </Item>
          <Item
            label='商品价格'
            name='price'
            rules={[
              { required: true, whitespace: true, message: '必须输入商品价格' },
              this.validatorPrice,
              // (() => this.validatorPrice),
              // () => ({
              //   validator(_, value) {
              //     if (value * 1 > 0) {
              //       return Promise.resolve();
              //     }
              //     return Promise.reject(new Error('商品价格必须大于0'));
              //   },
              // }),
            ]}
          >
            <Input prefix="￥" suffix="RMB" type='number' placeholder='请输入商品名称' />
          </Item>
          <Item
            label='商品分类'
            name='categoryIds'
            rules={[{ required: true, message: '必须指定商品分类' }]}
          >
            <Cascader
              placeholder='请指定商品分类'
              options={this.state.options}//需要显示的列表数据数组
              loadData={this.loadData}//当选择某个列表项，加载下一级列表的监听回调
              changeOnSelect
            />
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={this.picturesWallRef} images={images} />
          </Item>
          <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20, offset: 1 }}>
            <RichTextEditor ref={this.richTextEditorRef} detail={detail} />
          </Item>
          <Item>
            <Button type='primary' htmlType="submit">提交</Button>
          </Item>
        </Form>
      </Card >
    )
  }
}
