import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import {useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";


const useGetUser = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const res = await axios.get("http://localhost:5000/api/v1/user/getuser", { withCredentials: true });
            dispatch(setAuthUser(res.data.user));
          } catch (error) {
            console.log("Error fetching user data:", error);
          }
        };
      
        if (!user) {
          fetchUserData();
        }
      }, [user, dispatch]);

};

export default useGetUser;