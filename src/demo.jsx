import React from 'react';
import axios from 'axios';


export default () => {

    const getData = () => {
        axios.post('/user.do',{
            params:{
              ID:12345
            }
          })
    }

    return <div>
        <button onClick={() => {
            console.log('te1st');
            getData();
        }}>发送123请求</button>
    </div>
}