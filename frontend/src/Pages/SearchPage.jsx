import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Search } from "lucide-react";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!query) {
      setUsers([]);
      setError(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`http://localhost:5000/api/v1/user/search?query=${query}`, { withCredentials: true });

        if (res.data.success) {
          setUsers(res.data.users);
        }
      } catch (error) {
        setUsers([]);
        setError(error.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, token]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search users by username or fullname..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {loading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="animate-spin text-primary" size={24} />
        </div>
      )}

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}

      <div className="mt-4 bg-white rounded-lg shadow-md">
        {users.length > 0 ? (
          users.map((user) => (
            <Link
              key={user._id}
              to={`/profile/${user._id}`}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 transition-all border-b"
            >
              <Avatar className="size-10">
                <AvatarImage src={user.profilePic} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div>
                <p className="font-bold text-sm md:text-base">{user.username}</p>
                <p className="text-sm text-gray-600">{user.fullname}</p>
              </div>
            </Link>
          ))
        ) : (
          query &&
          !loading &&
          !error && <p className="mt-4 text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
