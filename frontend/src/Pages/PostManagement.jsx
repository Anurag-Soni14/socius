import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { FaEdit, FaTrash, FaSort } from "react-icons/fa";
import { useSelector } from "react-redux";
import useGetAllPost from "@/hooks/useGetAllPost";

const PostManagement = () => {
    useGetAllPost();
    const { posts } = useSelector((store) => store.posts);
  const [postStats, setPostStats] = useState({ totalPosts: 0, newPosts: 0, deletedPosts: 0 });
//   const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  

  useEffect(() => {
    fetchPostStats();
    setFilteredPosts(posts);
    console.log(posts);
    console.log(filteredPosts);
  }, []);

  const fetchPostStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/admin/post-stats", { withCredentials: true });
      setPostStats(res.data);
    } catch (error) {
      console.error("Error fetching post stats", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/all",{withCredentials: true});

      setPosts(res.data.posts);
      setFilteredPosts(res.data.posts);
      console.log(posts);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredPosts(posts.filter((post) => post.title.toLowerCase().includes(value)));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Post Stats & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Post Statistics</h2>
          <Bar data={{
            labels: ["Total Posts", "New Posts", "Deleted Posts"],
            datasets: [{
              label: "Post Stats",
              data: [postStats.totalPosts, postStats.newPosts, postStats.deletedPosts],
              backgroundColor: ["#4caf50", "#ff9800", "#f44336"]
            }]
          }} />
        </div>
        <div className="bg-base-100 shadow-md p-6 rounded-lg flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Post Stats Overview</h2>
          <p>Total Posts: <span className="font-bold">{postStats.totalPosts}</span></p>
          <p>New Posts: <span className="font-bold">{postStats.newPosts}</span></p>
          <p>Deleted Posts: <span className="font-bold">{postStats.deletedPosts}</span></p>
        </div>
      </div>

      {/* Post Table */}
      <div className="bg-base-100 shadow-md p-6 rounded-lg">
        <div className="flex justify-between mb-4">
          <input 
            type="text" 
            placeholder="Search posts..." 
            className="p-2 border rounded-lg" 
            value={searchText} 
            onChange={handleSearch} 
          />
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Sr. No.</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{post.title}</td>
                <td className="border p-2">{post.author}</td>
                <td className="border p-2">{new Date(post.createdAt).toLocaleDateString()}</td>
                <td className="border p-2 flex gap-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded"><FaEdit /></button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded"><FaTrash /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PostManagement;
