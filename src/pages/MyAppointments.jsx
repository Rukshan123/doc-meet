import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointments = () => {
    const { backendUrl, token, getDoctors } = useContext(AppContext);
    const [appointments, setAppointments] = useState([]);
    const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDataFormat = (slotDate) => {
        const dateArray = slotDate.split("_");
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
                headers: {
                    token,
                },
            });
            if (data.success) {
                toast.success(data.message || "Appointments fetched successfully");
                setAppointments(data.appointments.reverse()); // Reverse the appointments to show the latest first
            } else {
                toast.error(data.message || "Failed to fetch appointments");
            }
        } catch (error) {
            console.error("Error fetching appointments:", error);
            toast.error(error.response?.data?.message || "Failed to fetch appointments");
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/cancel-appointment`,
                { appointmentId },
                {
                    headers: {
                        token,
                    },
                }
            );
            if (data.success) {
                toast.success(data.message || "Appointment cancelled successfully");
                getUserAppointments(); // Refresh the appointments list
                getDoctors(); // Refresh the doctors list
            } else {
                toast.error(data.message || "Failed to cancel appointment");
            }
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast.error(error.response?.data?.message || "Failed to cancel appointment");
        }
    };

    useEffect(() => {
        if (token) {
            getUserAppointments();
        }
    }, [token]);

    return (
        <div>
            <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
            <div>
                {appointments.map((item, index) => (
                    <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-10 border-b" key={index}>
                        <div>
                            <img className="w-32 bg-indigo-50" src={item.docData.image} alt="" />
                        </div>
                        <div className="flex-1 text-sm text-zinc-600">
                            <p className="text-neutral-800 font-semibold">{item.docData.name}</p>
                            <p className="">{item.speciality}</p>
                            <p className="text-zinc-700 font-medium mt-1">Address</p>
                            <p className="text-xs">{item.docData.address?.line1}</p>
                            <p className="text-xs">{item.docData.address?.line2}</p>
                            <p className="text-sm mt-1">
                                <span className="text-sm text-neutral-700 font-medium">Date & time:</span>{" "}
                                {slotDataFormat(item.slotDate)} | {item.slotTime}
                            </p>
                        </div>

                        <div></div>

                        <div className="flex flex-col gap-2 justify-end">
                            {!item.cancelled && (
                                <button className="hidden text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-primary transition-all duration-300">
                                    Pay Online
                                </button>
                            )}
                            {!item.cancelled && (
                                <button
                                    onClick={() => cancelAppointment(item._id)}
                                    className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:text-white hover:bg-red-600 transition-all duration-300">
                                    Cancel appointment
                                </button>
                            )}

                            {item.cancelled && (
                                <button className="text-sm text-red-600 text-center sm:min-w-48 py-2 border rounded bg-red-50 disabled cursor-not-allowed">
                                    Appointment Cancelled
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyAppointments;
