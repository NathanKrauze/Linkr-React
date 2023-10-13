import axios from "axios"

function getConfig(token){
    return {
        headers:{
          Authorization: `Bearer ${token}` 
                }
      }
}

function getTimeline(token){
    const promisse = axios.get(`${process.env.REACT_APP_API_URL}/timeline`, getConfig(token))
    return promisse
}

function postPublish (token, body){
    const promisse = axios.post(`${process.env.REACT_APP_API_URL}/publish`,body, getConfig(token))
    return promisse
}

const apiAuth = {getTimeline, postPublish};
export default apiAuth