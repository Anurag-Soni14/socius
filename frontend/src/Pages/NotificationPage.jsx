import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { markNotificationsAsSeen, clearAllNotifications } from "@/redux/rtnSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

function NotificationPage() {
  const dispatch = useDispatch();
  const { notificationHistory, newNotifications } = useSelector(
    (store) => store.realTimeNotification
  );

  useEffect(() => {
    if (newNotifications?.length > 0) {
      dispatch(markNotificationsAsSeen()); // Move unseen notifications to history
    }
  }, [dispatch, newNotifications]);

  // Function to clear all notifications
  const handleClearNotifications = () => {
    dispatch(clearAllNotifications()); // Clears all notifications from Redux store & localStorage
  };

  return (
    <div className="pt-6 mr-6">
      <div className="flex justify-between items-center mb-6 border-b pb-3">
        <h2 className="text-xl font-semibold pl-3">🔔 Notifications</h2>
        {notificationHistory?.length > 0 && (
          <Button
            onClick={handleClearNotifications}
            className=" text-white px-4 py-2 rounded-lg shadow-md transition-all"
          >
            🗑 Clear All
          </Button>
        )}
      </div>

      {notificationHistory?.length > 0 ? (
        <div className="space-y-4">
          {notificationHistory.map((notification, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-base-200 rounded-lg shadow">
              {/* User Avatar */}
              <Avatar className="w-10 h-10">
                <AvatarImage src={notification?.userDetails?.profilePic} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {/* Notification Message */}
              <p className="text-sm text-base-content">
                <strong className="text-base-content">{notification?.userDetails?.username}</strong> {notification?.message}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No notifications yet.</p>
      )}
    </div>
  );
}

export default NotificationPage;
