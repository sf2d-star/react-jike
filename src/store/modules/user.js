//和用户相关的状态管理

import { createSlice } from "@reduxjs/toolkit";
import { request, setToken as _setToken, getToken  } from '@/utils'

const userStore = createSlice({
  name: 'user',
  //数据状态
  initialState: {
    //替换取
    token: getToken() || ''
    //token: localStorage.getItem('token_key') || ''
  },
  //同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload //存到redux里
      // localStorage存一份
      //替换存
      _setToken(action.payload)
      //localStorage.setItem('token_key', action.payload)
    }
  }
})


//解构出actionCreater
const { setToken } = userStore.actions

//获取reducer函数

 const userReducer = userStore.reducer

//异步方法 完成登陆 获取token
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    //1. 发送异步请求
    const res = await request.post('/authorizations', loginForm)
    console.log('Full response: ', res);

    //2. 提交同步action进行token的存入
    dispatch(setToken(res.data.data.token))
  }
}


 export { fetchLogin, setToken }

 export default userReducer
