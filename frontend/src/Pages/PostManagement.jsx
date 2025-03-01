import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { FaEdit, FaTrash, FaSort } from "react-icons/fa";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";

const PostManagement = () => {
  const [postStats, setPostStats] = useState({
    newPosts: 0,
    newComments: 0,
    totalPosts: 0,
    totalComments: 0,
  });
  const [posts, setPosts] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    fetchPostStats();
    fetchPosts();
  }, []);

  const fetchPostStats = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/v1/post/admin/post-stats",
        { withCredentials: true }
      );
      setPostStats(res.data.data);
    } catch (error) {
      console.error("Error fetching post stats", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/post/all", {
        withCredentials: true,
      });

      setPosts(res.data.posts);
      setFilteredPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    setFilteredPosts(
      posts.filter((post) => post.title.toLowerCase().includes(value))
    );
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/v1/post/admin/delete/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Post deleted successfully");
        fetchPosts();
      }
    } catch (error) {
      console.error("Error deleting post", error);
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Post Stats & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-base-100 shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Post Statistics</h2>
          <Bar
            data={{
              labels: [
                "New Posts",
                "New Comments",
                "Total Posts",
                "Total Comments",
              ],
              datasets: [
                {
                  label: "Post Stats",
                  data: [
                    postStats.newPosts,
                    postStats.newComments,
                    postStats.totalPosts,
                    postStats.totalComments,
                  ],
                  backgroundColor: ["#4caf50", "#ff9800", "#f44336"],
                },
              ],
            }}
          />
        </div>
        <div className="bg-base-100 shadow-md p-6 rounded-lg flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Post Stats Overview</h2>
          <p>
            New Posts: <span className="font-bold">{postStats.newPosts}</span>
          </p>
          <p>
            New Comments:{" "}
            <span className="font-bold">{postStats.newComments}</span>
          </p>
          <p>
            Total Posts:{" "}
            <span className="font-bold">{postStats.totalPosts}</span>
          </p>
          <p>
            Total Comments:{" "}
            <span className="font-bold">{postStats.totalComments}</span>
          </p>
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
              <th className="border p-2">Likes</th>
              <th className="border p-2">Comments</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Created At</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post, index) => (
              <tr key={post._id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">
                  {post.caption ? post.caption : "No caption..."}
                </td>
                <td className="border p-2">{post.likes.length}</td>
                <td className="border p-2">{post.comments.length}</td>
                <td className="border p-2">{post.author.username}</td>
                <td className="border p-2">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2 flex gap-2">
                  <button className="bg-green-500 text-white px-3 py-1 rounded">
                    <FaEdit />
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => {
                    setSelectedPost(post); setOpenDialog(true);}}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent
          onInteractOutside={() => setOpenDialog(false)}
          className="max-w-xl p-0 flex flex-col bg-base-100 text-base-content"
        >
          <VisuallyHidden>
            <DialogTitle>confirm delete</DialogTitle>
            <DialogDescription>
              admin confirmation for delete the post
            </DialogDescription>
          </VisuallyHidden>
          <div className="flex flex-col justify-center items-center p-6 gap-4">
            <div className="text-xl font-bold">
              <p>Are you sure to delete {selectedPost?.author?.username} ?</p>
            </div>
            <div className="flex gap-10 justify-center">
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setOpenDialog(false);
                }}
              >
                Cancel
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  handleDelete(selectedPost?._id);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostManagement;
