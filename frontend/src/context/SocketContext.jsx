import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const {user} = useSelector(store=>store.auth)

  useEffect(() => {
    // console.log("🟡 useEffect triggered, user:", user);
  
    if (!user) return;
  
    if (user?._id) {
      
        const socketInstance = io("http://localhost:5000", {
          query: { userId: user?._id },
          transports: ["websocket"],
          reconnection: true,
        });
  
        setSocket(socketInstance);
  
        socketInstance.on("connect", () => {
          // console.log("✅ React Socket connected with ID:", socketInstance.id);
        });
  
        socketInstance.on("connect_error", (err) => {
          // console.error("❌ WebSocket Connection Error:", err);
        });
  
        socketInstance.on("disconnect", (reason) => {
          // console.warn("⚠️ React Socket disconnected. Reason:", reason);
        });
  
        return () => {
          // socketInstance.disconnect();
          // console.log("❌ Cleanup: Socket disconnected");
        };
       // Delay connection by 2 seconds
    }
  }, [user]);
  
  

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
