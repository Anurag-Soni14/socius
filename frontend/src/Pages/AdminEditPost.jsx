import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const AdminEditPost = () => {
  const { id: postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    caption: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/v1/post/admin/fetch-post/${postId}`, {
          withCredentials: true,
        });
        setPost(res.data.post);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchPost();
  }, [postId]);

  // Handle input change
  const handleChange = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // Submit the updated post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("caption", post.caption);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/v1/post/admin/edit/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Post updated successfully!");
        navigate("/admin/posts");
      } else {
        toast.info(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <div className="bg-base-100 shadow-xl rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-primary mb-4">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Caption Input */}
          <div>
            <label className="block text-base-content font-medium">Caption</label>
            <textarea
              name="caption"
              value={post.caption}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded-lg bg-base-300 focus:ring focus:ring-primary"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-base-content font-medium">Post Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-lg bg-base-300"
            />
            {selectedImage ? (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Preview"
                className="mt-3 rounded-lg w-full h-48 object-cover shadow-md"
              />
            ) : post.image ? (
              <img
                src={post.image}
                alt="Post"
                className="mt-3 rounded-lg w-full h-48 object-cover shadow-md"
              />
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full bg-primary text-white py-2 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-focus"
            }`}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEditPost;
