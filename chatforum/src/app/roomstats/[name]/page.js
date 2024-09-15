"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "@/app/components/layout/Layout";
import { FaEye, FaTrash } from "react-icons/fa";
import getcsrftoken from '@/helpers/getcsrftoken';
import { useRouter } from "next/navigation";


export default function page({ params }) {
    const router = useRouter()

    const [threads, setThreads] = useState([])
    const [totalthreads, settotalThreads] = useState(0)
    const [refreshKey, setrefreshKey] = useState(0)

    useEffect(() => {
        getThreads();
    }, [refreshKey]);

    const getThreads = async () => {
        try {

            const csrftoken = await getcsrftoken()
            const response = await axios.get(`http://localhost:8000/api/${params.name}/getthreads`, {
                headers: { "X-CSRFToken": csrftoken.value },
                withCredentials: true,
            });
            if (response.data.status == "successful") {
                setThreads(response.data.threads)
                settotalThreads(response.data.threads.length)
            }
        } catch (err) {
            console.log(err.message);
        }
    }

    const handleDelete = async (threadid) => {
        const csrftoken = await getcsrftoken()
        try {

            const response = await axios.get(`http://localhost:8000/api/deletethreads/${params.name}/${threadid}`,
                {
                    headers: { "X-CSRFToken": csrftoken.value },
                    withCredentials: true
                });
            if (response.data.status == "delete_successfull") {
                console.log("Data Deleted")
                if (response.data.threads.length === 0) {
                    settotalThreads(0)
                    setThreads([]);
                } else {
                    setThreads(response.data.threads);
                }
                setrefreshKey((currentvalue) => currentvalue + 1)
            }

        } catch (err) {
            console.log(err.message)
        }
    }


    return (
        <Layout>
            <div className="min-h-screen p-4 md:p-8">
                {/* Heading Section */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    Total Threads : {totalthreads}
                </h1>

                {/* Table Section */}
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="px-4 py-2 text-left text-gray-800">Thread ID</th>
                                <th className="px-4 py-2 text-left text-gray-800">Title</th>
                                <th className="px-4 py-2 text-left text-gray-800">Created By (UserID)</th>
                                <th className="px-4 py-2 text-left text-gray-800">Created At</th>
                                <th className="px-4 py-2 text-left text-gray-800">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {threads.map((thread, index) => (
                                <tr
                                    key={thread.id}
                                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                                >
                                    <td className="border px-4 py-2">{thread.id}</td>
                                    <td className="border px-4 py-2">{thread.title}</td>
                                    <td className="border px-4 py-2">{thread.created_by}</td>
                                    <td className="border px-4 py-2">{thread.created_at}</td>
                                    <td className="border px-4 py-2 text-center">
                                        <button className="text-red-500 hover:text-red-700 inline-block w-4 h-6"
                                            onClick={() => handleDelete(thread.id)}>
                                            <FaTrash />
                                        </button >

                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    )
}