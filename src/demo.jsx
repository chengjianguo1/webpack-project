import React from 'react';
import axios from 'axios';


export default () => {

    const getPostData = () => {
        axios.post('/info.do',{
            data:{
                id: 12345
            }
          })
    }

    const getData = () => {
        axios.post('/user.do',{
            params:{
              ID:12345
            }
          })
    }

    return <div>
        <button onClick={getPostData}>发送post请求</button>
        <button onClick={getData}>发送get请求</button>
    </div>
}