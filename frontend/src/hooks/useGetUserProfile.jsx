import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchUserProfile = async () => {
      if (!userId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/user/${userId}/profile`, { withCredentials: true });

        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (err) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [dispatch, userId]);

  return { loading, error }; 
};

export default useGetUserProfile;
