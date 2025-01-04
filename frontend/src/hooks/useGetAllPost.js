// const { useEffect } = require("react");
// const { useDispatch } = require("react-redux");
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import React,{useEffect} from 'react';
import { useDispatch } from "react-redux";


const useGetAllPost = () => {
    const dispatch = useDispatch();
    useEffect(()=> {
        const fetchAllPosts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/post/all",{withCredentials: true});
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllPosts();
    },[])

};

export default useGetAllPost;