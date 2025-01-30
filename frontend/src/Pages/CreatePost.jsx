import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { readFileAsDataURL } from "@/lib/utils";
import { setPosts } from "@/redux/postSlice";
import store from "@/redux/store";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

function CreatePost({ openDialogForCreate, setOpenDialogForCreate }) {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.posts);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };
  
  const createPostHandler = async (e) => {
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpenDialogForCreate(false);
      } else {
        toast.info(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={openDialogForCreate}>
      <DialogContent onInteractOutside={() => setOpenDialogForCreate(false)} className="bg-base-100 text-base-content">
        <VisuallyHidden>
          <DialogTitle>Buttons</DialogTitle>
          <DialogDescription>a dialog to create the posts</DialogDescription>
        </VisuallyHidden>
        <DialogHeader className="text-center font-semibold text-base-content">
          Create New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePic} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs text-base-content">{user?.username}</h1>
            <span className="text-gray-600 text-xs">bio...</span>
          </div>
        </div>
        <Textarea
          className="focus-visible:ring-transparent border-none bg-base-200 text-base-content"
          placeholder="Write a caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {imagePreview && (
          <div className="w-full h-64 flex items-center justify-center">
            <img
              src={imagePreview}
              alt="preview image"
              className="object-cover h-full w-full rounded-md"
            />
          </div>
        )}

        <input
          ref={imageRef}
          type="file"
          className="hidden"
          onChange={fileChangeHandler}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-primary text-base-100 hover:bg-primary-focus"
        >
          Select from computer
        </Button>

        {imagePreview &&
          (loading ? (
            <Button className="bg-primary text-base-100">
              <Loader2 className="mr-2 size-4 animate-spin" /> Please Wait...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-primary text-base-100 hover:bg-primary-focus"
              onClick={createPostHandler}
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
