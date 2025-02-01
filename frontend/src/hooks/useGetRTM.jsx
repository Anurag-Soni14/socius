import { useSocket } from "@/context/SocketContext";
import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { messages } = useSelector((store) => store.chat);

  useEffect(() => {
    // const handleNewMessage = (newMessage) => {
    //   dispatch(setMessages([...messages, newMessage]));
    // };

    socket?.on("newMessage", (newMessage) => {
        dispatch(setMessages([...messages, newMessage]));
      });

    return () => {
      socket?.off("newMessage");
    };
  }, [socket, messages, dispatch]); // ✅ Fixed dependencies

};

export default useGetRTM;
