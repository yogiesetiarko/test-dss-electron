const { default: axios } = require('axios');

const handleLogin = async (payload, opt) => {
  // const resp = await axios.post('http://127.0.0.1:8000/api/task', opt);
  // return resp.data.task;

  let newResp = await axios.post('https://dummyjson.com/auth/login', {'username': payload.username,'password': payload.password}, {
    headers: { 'Content-Type': 'application/json' }
  })
  .then(function (response) {
    // console.log("response.data", response.data);
    // return response.data;
    return {
      success: true,
      data: response.data,
      message: "Login Success."
    };
  })
  .catch(function (error) {
    // console.log("error", error.response.data.message);
    // return error;
    return {
      success: false,
      data: null,
      message: error.response.data.message
    }
  });  
  return newResp;
};

module.exports = { handleLogin };
