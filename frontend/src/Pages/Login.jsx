import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoding] = useState(false);
  const [formData, setFormData] = useState({
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
        "http://localhost:5000/api/v1/user/login",
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
          email: "",
          password: "",
        });
      }else{
        toast.error(res.data.message);
      }

    } catch (error) {
        console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setLoding(false);
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        className="shadow-lg flex flex-col gap-5 p-8"
        onSubmit={handleSubmit}
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-center text-sm">
            Login now to explore the world of socius
          </p>
        </div>
        <div>
          <Label className="ml-3">E-mail</Label>
          <Input
            type="email"
            name="email"
            className="focus-visible:ring-transparent my-2"
            value={formData.email}
            onChange={validateForm}
          />
        </div>
        <div>
          <Label className="ml-3">Password</Label>
          <Input
            type="password"
            name="password"
            className="focus-visible:ring-transparent my-2"
            value={formData.password}
            onChange={validateForm}
          />
        </div>
        {
            isLoading? (
                <Button>
                    {/* <Spinner /> */}
                    <Loader2 className="mr-2 size-4 animate-spin"/> Please Wait
                </Button>
            ) : (

                <Button>Login</Button>
            )
        }
        <span className="text-center">
          Doesn't have an account?{" "}
          <Link to="/signup" className="text-blue-500">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
