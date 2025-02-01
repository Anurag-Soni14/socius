import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessages = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!selectedUser?._id) return; // ✅ Ensure valid user ID before fetching

    const fetchAllMessages = async () => {
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
      }
    };

    fetchAllMessages();
  }, [selectedUser]); // ✅ Re-fetch messages when `selectedUser` changes
};

export default useGetAllMessages;
