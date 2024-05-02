/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */
import { IoIosSearch } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import { GrFormView } from "react-icons/gr";
import { useEffect, useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";

import { v4 as uuidv4 } from "uuid";
import { Link, useNavigate } from "react-router-dom";

function Nav({ onAddWorkflow, search, setSearch }) {
    const [popup, setPopup] = useState(false);
    const [workflowTitle, setWorkflowTitle] = useState("");

    return (
        <>
            {popup && (
                <div className="absolute inset-0 bg-[#b0afafac] flex justify-center items-center p-4">
                    <div className="bg-[#eaeaea] rounded-md space-y-4 p-4 w-[400px] absolute">
                        <div className="flex items-center justify-between">
                            <div className="text-md font-semibold">
                                Workflow info
                            </div>
                            <button
                                onClick={() => setPopup(false)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                                <IoCloseOutline size={25} />
                            </button>
                        </div>
                        <div className="flex flex-col gap-4 justify-center items-start">
                            <input
                                placeholder="Give a name to your workflow"
                                value={workflowTitle}
                                onChange={(e) =>
                                    setWorkflowTitle(e.target.value)
                                }
                                className="outline-none w-full px-4 py-1 rounded-md text-lg text-slate-700"
                            />
                            <button
                                onClick={() => onAddWorkflow(workflowTitle)}
                                className="font-semibold text-md transition-all duration-200 ease-in-out hover:bg-[#302e42] bg-[#585596] text-[white] px-4 py-2 rounded-md"
                            >
                                Create Workflow
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="w-5/6 flex items-center justify-between">
                <div className="flex items-center py-2 px-4 bg-white w-fit rounded-md shadow-md">
                    <IoIosSearch size={20} color="grey" />
                    <input
                        placeholder="Search workflow"
                        className="outline-none px-4 text-md text-slate-700"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <button
                    onClick={() => setPopup(true)}
                    className="font-semibold text-md transition-all duration-200 ease-in-out hover:bg-[#302e42] bg-[#585596] text-[white] px-4 py-2 rounded-md"
                >
                    Add new Workflow
                </button>
            </div>
        </>
    );
}

function DashboardContent({ workflows, onRemoveWorkflow }) {
    return (
        <>
            {workflows.length < 1 ? (
                <div className="flex-grow flex justify-center mt-40">
                    <h1 className="text-3xl font-semibold">
                        You don't have any Workflow right now.
                    </h1>
                </div>
            ) : (
                <div className="w-5/6 space-y-4 sm:h-[500px] overflow-y-scroll mt-10">
                    {workflows.map(({ title, steps, createdAt, id }) => {
                        return (
                            <div
                                key={id}
                                className="flex bg-[white] rounded-lg px-10 py-5 justify-between"
                            >
                                <div>
                                    <div className="font-semibold text-md">
                                        {title}
                                    </div>
                                    <div className="text-slate-600 font-medium">
                                        {steps} Steps
                                    </div>
                                </div>

                                <div>
                                    <div className="font-semibold text-md">
                                        Publish
                                    </div>
                                    <div className="text-slate-600 font-medium">
                                        {createdAt}
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <Link
                                        to={`/workflow/${id}`}
                                        className="flex items-center gap-2"
                                    >
                                        <GrFormView size={20} color="#585596" />
                                        <div className="text-[#585596] font-semibold">
                                            View
                                        </div>
                                    </Link>
                                    <button
                                        onClick={() => onRemoveWorkflow(id)}
                                        className="flex items-center gap-2"
                                    >
                                        <MdOutlineDeleteOutline
                                            size={20}
                                            color="#585596"
                                        />
                                        <div className="text-[#585596] font-semibold">
                                            Delete
                                        </div>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
}

export function Dashboard() {
    const [workflows, setWorkflows] = useState(() => {
        return localStorage.getItem("workflows")
            ? JSON.parse(localStorage.getItem("workflows"))
            : [];
    });

    const [search, setSearch] = useState("");

    useEffect(() => {
        if (search.length == 0) {
            setWorkflows(() => {
                return localStorage.getItem("workflows")
                    ? JSON.parse(localStorage.getItem("workflows"))
                    : [];
            });
            return;
        }

        setWorkflows((prev) => {
            return prev.filter((p) => p.title.includes(search));
        });
    }, [search]);

    const navigate = useNavigate();

    function handleAddWorkflow(title) {
        if (!title) return;

        const id = uuidv4();
        const workflow = {
            createdAt: new Date().toLocaleString(),
            id,
            title,
            steps: 0,
            cards: [],
            edges: [],
        };

        if (!localStorage.getItem("workflows")) {
            localStorage.setItem("workflows", JSON.stringify([]));
        }
        const items = JSON.parse(localStorage.getItem("workflows"));
        localStorage.setItem("workflows", JSON.stringify([...items, workflow]));

        setWorkflows((prev) => [...prev, workflow]);
        navigate(`/workflow/${id}`);
    }

    function handleRemoveWorkflow(id) {
        const updatedWorkflows = workflows.filter((w) => w.id !== id);
        setWorkflows((prev) => prev.filter((p) => p.id !== id));

        localStorage.setItem("workflows", updatedWorkflows);
    }

    return (
        <div className="mx-auto h-full flex items-center flex-col relative py-10">
            <Nav onAddWorkflow={handleAddWorkflow} search={search} setSearch={setSearch}/>
            <DashboardContent
                workflows={workflows}
                onRemoveWorkflow={handleRemoveWorkflow}
            />
        </div>
    );
}
