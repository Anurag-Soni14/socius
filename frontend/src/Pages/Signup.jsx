import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoding] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });

  const validateForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoding(true);
      const res = await axios.post(
        "http://localhost:5000/api/v1/user/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setFormData({
          username: "",
          fullname: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      setLoding(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-base-100">
      <form
        className="shadow-lg flex flex-col gap-5 p-8 bg-base-200 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl text-primary">LOGO</h1>
          <p className="text-center text-sm text-base-content">
            Signup now to explore the world of socius
          </p>
        </div>
        <div>
          <Label className="ml-3 text-base-content">Username</Label>
          <Input
            type="text"
            name="username"
            className="focus-visible:ring-primary my-2 bg-base-100 text-base-content"
            value={formData.username}
            onChange={validateForm}
          />
        </div>
        <div>
          <Label className="ml-3 text-base-content">Full Name</Label>
          <Input
            type="text"
            name="fullname"
            className="focus-visible:ring-primary my-2 bg-base-100 text-base-content"
            value={formData.fullname}
            onChange={validateForm}
          />
        </div>
        <div>
          <Label className="ml-3 text-base-content">E-mail</Label>
          <Input
            type="email"
            name="email"
            className="focus-visible:ring-primary my-2 bg-base-100 text-base-content"
            value={formData.email}
            onChange={validateForm}
          />
        </div>
        <div>
          <Label className="ml-3 text-base-content">Password</Label>
          <Input
            type="password"
            name="password"
            className="focus-visible:ring-primary my-2 bg-base-100 text-base-content"
            value={formData.password}
            onChange={validateForm}
          />
        </div>
        {isLoading ? (
          <Button className="bg-primary text-white hover:bg-primary-focus w-full">
            <Loader2 className="mr-2 size-4 animate-spin" />
            Please Wait...
          </Button>
        ) : (
          <Button className="bg-primary text-white hover:bg-primary-focus w-full">
            Create Account
          </Button>
        )}
        <span className="text-center text-base-content">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Signup;
