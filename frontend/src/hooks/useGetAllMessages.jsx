import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) return; // ✅ Ensure valid user ID before fetching

    const fetchAllMessages = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/v1/message/all/${selectedUser._id}`,
          { withCredentials: true }
        );

        if (res.data.success) {
          dispatch(setMessages(res.data.messages));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally{
        setLoading(false);
      }
    };

    fetchAllMessages();
  }, [selectedUser]); // ✅ Re-fetch messages when `selectedUser` changes

  return { loading };
};

export default useGetAllMessages;
