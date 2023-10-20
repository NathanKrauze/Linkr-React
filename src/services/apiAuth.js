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

function deletePost (token, params){
    const promisse = axios.delete(`${process.env.REACT_APP_API_URL}/delete/${params}`, getConfig(token))
    return promisse
}


function likePost(id, token, liked){
    const promise = axios.post(`${process.env.REACT_APP_API_URL}/like/${id}`, {liked}, getConfig(token));
    return promise
}

function updatePost (token, params, body){
    const promisse = axios.post(`${process.env.REACT_APP_API_URL}/update-post/${params}`, body, getConfig(token))
    return promisse
}

function getUsersLikes(id, token){
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/like/${id}`, getConfig(token));
    return promise
}

function getUser(id, token){
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users/${id}`, getConfig(token));
    return promise;
}

function getSearchUsers(searchString, token){
    const promise = axios.get(`${process.env.REACT_APP_API_URL}/users?searchString=${searchString}`, getConfig(token));
    return promise;
}

const apiAuth = {getTimeline, postPublish, deletePost, likePost, updatePost, getUsersLikes, getUser, getSearchUsers};

export default apiAuth
