import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import {useEffect} from 'react';
import { useDispatch } from "react-redux";


const useGetFollowingPosts = () => {
    const dispatch = useDispatch();
    useEffect(()=> {
        const fetchFollowingPosts = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/v1/post/following-posts",{withCredentials: true});
                if(res.data.success){
                    dispatch(setPosts(res.data.posts))
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchFollowingPosts();
    },[])

};

export default useGetFollowingPosts;