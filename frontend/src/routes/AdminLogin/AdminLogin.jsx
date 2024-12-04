import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormComponent from "../../components/FormComponent/FormComponent";
import { loginAdmin } from "../../api/api";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const handleLogin = async (formData) => {
    try {
      setLoading(true);
      const response = await loginAdmin({
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.access_token); // Save JWT token
      const decodedToken = jwtDecode(response.data.access_token); // Decode the token

      // Extract the email (sub) from the token
      const email = decodedToken.sub;
      localStorage.setItem("email", email); // Save email
      localStorage.setItem("username", formData.username); // Save username
      localStorage.setItem("role", "admin"); // Save role as admin

      toast.success("Login Successful!");
      setLoading(false);
      // Wait for 2 seconds before navigating to the dashboard
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Login failed:", error);
      toast.error("Login Failed: Invalid credentials");
    }
  };

  const fields = [
    {
      label: "Username",
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      isRequired: true,
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      isRequired: true,
    },
  ];

  return (
    <div className=" items-center  flex flex-col justify-center md:justify-normal md:flex-row">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-8 py-6 sm:mt-12">
        <FormComponent
          title="Admin Login"
          fields={fields}
          onSubmit={handleLogin}
          submitButtonText="Login"
          loading={loading}
        />
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img
          src="/admin.png"
          alt="Admin Login Illustration"
          className="w-full md:block hidden"
        />
      </div>
    </div>
  );
};

export default AdminLogin;
