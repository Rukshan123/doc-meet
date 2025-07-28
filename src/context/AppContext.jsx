import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "$";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

    const [userData, setUserData] = useState(false);

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-profile`, { headers: { token } });

            if (data.success) {
                setUserData(data.user);
                toast.success(data.message || "User profile data loaded successfully");
            } else {
                toast.error(data.message || "Failed to load user profile data");
                console.error("Failed to load user profile data:", data.message);
            }
        } catch (error) {
            console.error("Error loading user profile data:", error);
            toast.error(error.response.data.message || "Failed to load user profile data. Please try again later.");
        }
    };

    const getDoctors = async () => {
        try {
            const data = await axios.get(`${backendUrl}/api/doctor/list`);
            if (data.data.success) {
                toast.success(data.message || "Doctors fetched successfully");
                setDoctors(data.data.doctors);
            } else {
                throw new Error("Failed to fetch doctors");
            }
        } catch (error) {
            console.error("Error fetching doctors:", error);
            toast.error(error.response.data.message || "Failed to fetch doctors. Please try again later.");
        }
    };

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl,
        userData,
        setUserData,
        loadUserProfileData,
    };

    useEffect(() => {
        getDoctors();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData();
        } else {
            setUserData(false);
        }
    }, [token]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
