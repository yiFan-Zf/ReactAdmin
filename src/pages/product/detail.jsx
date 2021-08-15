import React, { Component } from 'react'
import { Card, List, Button } from 'antd'
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';


import { reqCategoryById, } from '../../api'

const { Item } = List
/* 
Product的详情页的子路由组件
*/
export default class ProductDetail extends Component {

  state = {
    cName1: '',//一级分类名称
    cName2: '',//二级分类名称
  };


  async componentDidMount() {

    //得到当前商品的分类ID
    const { pcategoryId, categoryId } = this.props.location.state.product
    if (pcategoryId === '0') {//一级分类下的商品
      const result = await reqCategoryById(categoryId)
      this.setState({ cName1: result.name })
    } else {//二级分类下的商品
      // 通过多个await方式发多个请求：后面一个请求是在前一个请求成功返回之后才发送------效率存在问题
      /*  const result1 = await reqCategoryById(pcategoryId)
       const result2 = await reqCategoryById(categoryId)
       this.setState({ cName1: result1.name, cName2: result2.name })
      */

      // 一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategoryById(pcategoryId), reqCategoryById(categoryId)])
      const cName1 = results[0].name
      const cName2 = results[1].name
      this.setState({ cName1, cName2 })

    }

  }

  render() {

    // 读取路由携带过来的state数据
    const { name, desc, price, detail, } = this.props.location.state.product
    const { cName1, cName2 } = this.state
    const title = (
      <span>
        <Button type='link'> <ArrowLeftOutlined onClick={() => this.props.history.goBack()} /></Button>
        <span>商品详情</span>
      </span>
    )

    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            <span>{cName1}{cName2 ? '  -->' + cName2 : ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            <span>
              {/*   {
                images.map((img) => {
                  return (
                    <img src={img} alt="img" key={img} className='product-img' />
                  )
                })
              } */}
              <img src="https://img2.baidu.com/it/u=2534856119,1465177104&fm=26&fmt=auto&gp=0.jpg" alt="img" className='product-img' />
              <img src="https://img2.baidu.com/it/u=2534856119,1465177104&fm=26&fmt=auto&gp=0.jpg" alt="img" className='product-img' />
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情：</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card >
    )
  }
}
