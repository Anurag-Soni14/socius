import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { setAuthUser } from "@/redux/authSlice";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Logo from "../assets/Logo.png";

function Login() {
  const { user } = useSelector((store) => store.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoding] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
        setFormData({
          email: "",
          password: "",
        });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoding(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="flex items-center w-screen h-screen justify-center bg-base-100">
      <form
        className="shadow-lg flex flex-col gap-5 p-8 bg-base-200 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="my-4">
          <div className="w-full flex justify-center">
            <img src={Logo} alt="Logo" className="w-40" />
          </div>
          <p className="text-center text-sm text-base-content">
            Login now to explore the world of socius
          </p>
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
            Login
          </Button>
        )}
        <span className="text-center text-base-content">
          Doesn't have an account?{" "}
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Login;
