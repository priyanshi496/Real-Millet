import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategory from "../components/EditCategory";
import CofirmBox from "../components/CofirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const CategoryPage = () => {
    const [openUploadCategory, setOpenUploadCategory] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [editData, setEditData] = useState({
        name: "",
        image: "",
    });
    const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
    const [deleteCategory, setDeleteCategory] = useState({
        _id: "",
    });

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.getCategory,
            });
            const { data: responseData } = response;

            if (responseData.success) {
                setCategoryData(responseData.data);
            }
        } catch(error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategory();
    }, []);

    const handleDeleteCategory = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.deleteCategory,
                data: deleteCategory,
            });
            const { data: responseData } = response;

            if (responseData.success) {
                toast.success(responseData.message);
                fetchCategory();
                setOpenConfirmBoxDelete(false);
            }
        } catch (error) {
            AxiosToastError(error);
        }
    };

    return (
        <section className="p-4 bg-slate-50 min-h-full">
            {/* Header */}
            <div className="p-4 bg-white shadow-md rounded-lg flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-700">Manage Categories</h2>
                <button
                    onClick={() => setOpenUploadCategory(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                    Add Category
                </button>
            </div>
            
            {/* Display when no data is available */}
            {!categoryData[0] && !loading && <NoData />}

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {categoryData.map((category) => (
                    <div className="bg-white rounded-lg shadow-md flex flex-col overflow-hidden group transition-transform duration-300 hover:scale-105" key={category._id}>
                        {/* Image Container */}
                        <div className="w-full aspect-square bg-slate-100 flex items-center justify-center p-2">
                            <img
                                alt={category.name}
                                src={category.image}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="p-3 flex flex-col flex-grow">
                            {/* Category Name */}
                            <h3 className="text-md font-semibold text-slate-800 text-center capitalize mb-3 flex-grow">
                                {category.name}
                            </h3>

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-auto">
                                <button
                                    onClick={() => {
                                        setOpenEdit(true);
                                        setEditData(category);
                                    }}
                                    className="w-full bg-green-100 hover:bg-green-200 text-green-700 font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setOpenConfirmBoxDelete(true);
                                        setDeleteCategory(category);
                                    }}
                                    className="w-full bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1.5 px-3 rounded-md text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {loading && <Loading />}

            {openUploadCategory && (
                <UploadCategoryModel
                    fetchData={fetchCategory}
                    close={() => setOpenUploadCategory(false)}
                />
            )}

            {openEdit && (
                <EditCategory
                    data={editData}
                    close={() => setOpenEdit(false)}
                    fetchData={fetchCategory}
                />
            )}

            {openConfimBoxDelete && (
                <CofirmBox
                    close={() => setOpenConfirmBoxDelete(false)}
                    cancel={() => setOpenConfirmBoxDelete(false)}
                    confirm={handleDeleteCategory}
                />
            )}
        </section>
    );
};

export default CategoryPage;