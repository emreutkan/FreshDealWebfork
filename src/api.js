import axios from "axios";

const userLogin = async (email, password) => {
    const response = await axios.get('api-url', {
      headers: {

      },
      params: {
        email,
        password
      }
    })
console.log(response)
    return response;
  }

  export default userLogin;