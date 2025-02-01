import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useSelector((store) => store.auth);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user?._id) {
      const socketInstance = io("http://localhost:5000", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      setSocket(socketInstance);

      // ✅ Handle browser close event
      const handleBeforeUnload = () => {
        socketInstance.emit("manualDisconnect");
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        socketInstance.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
