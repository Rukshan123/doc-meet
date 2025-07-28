import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [state, setState] = useState("Sign Up");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const { token, setToken, backendUrl } = useContext(AppContext);
    const navigate = useNavigate();

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {
            if (state === "Sign Up") {
                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                    name,
                    email,
                    password,
                });
                if (data.success) {
                    localStorage.setItem("token", data.token); // Store the token in localStorage
                    setToken(data.token); // Store the token in context
                    toast.success(data.message || "Account created successfully");
                    setState("Login");
                } else {
                    toast.error(data.message || "Failed to create account");
                }
            } else {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, {
                    email,
                    password,
                });
                console.log(data);
                if (data.success) {
                    localStorage.setItem("token", data.token); // Store the token in localStorage
                    toast.success(data.message || "Login successful..");
                    setToken(data.token); // Store the token in context
                } else {
                    toast.error(data.message || "Failed to login");
                }
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message || "Error please try again.");
            }
            console.error("Error during login/signup:", error);
        }
    };

    useEffect(() => {
        if (token) {
            navigate("/");
        }
    }, [token]);

    return (
        <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
            <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
                <p className="text-2xl font-semibold">{state === "Sign Up" ? "Create Account" : "Login"}</p>
                <p>Please {state === "Sign Up" ? "sign up" : "log in"} to book appointment</p>

                {state === "Sign Up" && (
                    <div className="w-full">
                        <p>Full name</p>
                        <input
                            className="border border-zinc-300 rounded w-full p-2 mt-1"
                            type="text"
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                            value={name}
                            required
                        />
                    </div>
                )}

                <div className="w-full">
                    <p>Email</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        value={email}
                        required
                    />
                </div>

                <div className="w-full">
                    <p>Password</p>
                    <input
                        className="border border-zinc-300 rounded w-full p-2 mt-1"
                        type="password"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        value={password}
                        required
                    />
                </div>

                <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base">
                    {state === "Sign Up" ? "Create Account" : "Login"}
                </button>

                {state === "Sign Up" ? (
                    <p className="text-sm text-zinc-500 mt-2">
                        Already have an account?{" "}
                        <span className="text-primary cursor-pointer" onClick={() => setState("Login")}>
                            Login
                        </span>
                    </p>
                ) : (
                    <p className="text-sm text-zinc-500 mt-2">
                        Don't have an account?{" "}
                        <span className="text-primary cursor-pointer" onClick={() => setState("Sign Up")}>
                            Sign Up
                        </span>
                    </p>
                )}
            </div>
        </form>
    );
};

export default Login;
