import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
    const { speciality } = useParams();
    const { doctors } = useContext(AppContext);
    const [filterDoc, setFilterDoc] = useState([]);
    const [showFilter, setShowFilter] = useState(false);

    const navigate = useNavigate();

    const applyFilter = () => {
        if (speciality) {
            setFilterDoc(doctors.filter((doctor) => doctor.specialization === speciality));
        } else {
            setFilterDoc(doctors);
        }
    };

    useEffect(() => {
        applyFilter();
    }, [speciality, doctors]);

    const specialities = [
        { name: "General physician" },
        { name: "Gynecologist" },
        { name: "Dermatologist" },
        { name: "Pediatricians" },
        { name: "Neurologist" },
        { name: "Gastronterologist" },
    ];

    return (
        <div>
            <p className="text-gray-600">Browse through the doctors speciality.</p>
            <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
                <button
                    className={`py-1 px-3 border rounded text-sm transition-all sm:hidden${
                        showFilter ? " bg-primary text-white" : ""
                    }`}
                    onClick={() => setShowFilter((prev) => !prev)}>
                    Filters
                </button>

                <div className={` flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"}`}>
                    {specialities.map(({ name }) => (
                        <p
                            key={name}
                            onClick={() => (speciality === name ? navigate("/doctors") : navigate(`/doctors/${name}`))}
                            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 cursor-pointer rounded transition-all ${
                                speciality === name ? "bg-indigo-100 text-black" : ""
                            }`}>
                            {name}
                        </p>
                    ))}
                </div>

                <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
                    {filterDoc.map((doctor, index) => (
                        <div
                            onClick={() => navigate(`/appointment/${doctor._id}`)}
                            key={index}
                            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
                            <img className="bg-blue-50" src={doctor.image} alt="" />
                            <div className="p-4">
                                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                                    <p>Available</p>
                                </div>
                                <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
                                <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Doctors;
