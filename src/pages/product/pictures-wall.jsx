import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { BASE_URL, BASE_IMAGES_URL } from '../../utils/constants'
import { reqDeleteProductsImages } from '../../api'


/* 
用于图片上传的组件
*/

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,//标识是否显示大图预览Modal
    previewImage: '',//大图的url
    previewTitle: '',
    fileList: [
      // {
      //   uid: '-1',/* 每个file都有自己唯一的id */
      //   name: 'image.png',/* 图片文件名 */
      //   status: 'done',/* 图片状态 done：已上传 ，uploading:正在上传中 removed:已删除 */
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
    ],
  };

  /* 视频教程方法---本次所使用后台不适用此方法 */
  // constructor(props) {
  //   super(props)

  //   let fileList = []
  //   // 如果传入了images属性
  //   const { images } = this.props
  //   console.log(images);
  //   console.log(typeof images);
  //   if (images && images.length > 0 && typeof images === 'array') {
  //     fileList = images.map((img, index) => ({
  //       uid: -index,/* 每个file都有自己唯一的id */
  //       name: img,/* 图片文件名 */
  //       status: 'done',/* 图片状态 done：已上传 ，uploading:正在上传中 removed:已删除 */
  //       url: BASE_IMAGES_URL + img,

  //     }))
  //   }

  //   // 初始化状态
  //   this.state = {
  //     previewVisible: false,//标识是否显示大图预览Modal
  //     previewImage: '',//大图的url
  //     previewTitle: '',
  //     fileList,//所有已上传图片的数组
  //   }
  // }

  /* 初始化 fileList*/
  initPreviewImages = () => {
    // if (this.props.images === '') {
    //   return;
    // }
    if (this.props.images && this.props.images !== '') {
      let fileList = []
      this.props.images.split(',').forEach((item, index) => {
        fileList.push({
          uid: -index,
          url: BASE_IMAGES_URL + item,
          name: item,
          size: 0,
          type: 'image/webp',
          status: 'done',
        });
      });

      this.setState({
        fileList,
      });
    }
  }

  /* 获取所有已上传图片文件名的数组 */
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  /* 隐藏Modal */
  handleCancel = () => this.setState({ previewVisible: false });

  /* 显示指定file对应的大图 */
  handlePreview = async file => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  /* 
  file ：当前操作的文件对象(上传/删除)
  fileList：所有已上传图片文件对象的数组
  */
  handleChange = async ({ file, fileList }) => {
    console.log('file', file.status);
    // 在操作（上传/下载）过程中更新fileList状态

    // 一旦上传成功，将当前上传的file的信息修正(name,file)
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('图片上传成功')
        const { name, url } = result.data
        // file=fileList[fileList.length-1]
        file.name = name
        file.url = url
      } else {
        message.error('图片上传失败')
      }
    } else if (file.status === 'removed') {//删除图片
      const result = await reqDeleteProductsImages(file.name)
      if (result.status === 0) {
        message.success('删除图片成功')
      } else {
        message.success('删除图片失败')
      }
    }

    this.setState({ fileList })
  };

  componentDidMount() {
    this.initPreviewImages()
  }


  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          action={BASE_URL + '/uploadFile'}  /* 上传图片的接口地址 */
          // action={'/api/products/updateImages/'}  /* 上传图片的接口地址 */
          accept='image/*' /* 只接受图片格式 */
          name='image'/* 请求参数名 */
          listType="picture-card"/* 卡片样式 */
          fileList={fileList}/* 所有已上传图片文件对象的数组 */
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}
