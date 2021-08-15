/* 
  入口js
*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import 'antd/dist/antd.css'
import { BrowserRouter } from 'react-router-dom'
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'

//读取local中保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);


