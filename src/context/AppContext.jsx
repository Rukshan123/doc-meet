import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
    const currencySymbol = "$";
    const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");

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
            toast.error(error.message || "Failed to fetch doctors. Please try again later.");
        }
    };

    const value = {
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl,
    };

    useEffect(() => {
        getDoctors();
    }, []);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export default AppContextProvider;
