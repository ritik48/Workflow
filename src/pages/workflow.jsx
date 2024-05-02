/* eslint-disable react/prop-types */
import { IoIosArrowRoundBack } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import ReactFlow, {
    Background,
    Controls,
    MarkerType,
    MiniMap,
    SelectionMode,
    addEdge,
    useEdgesState,
    useNodesState,
} from "reactflow";
import { Card } from "../components/Cards";
import { useWorflowContext } from "../WorkflowContext";

function Nav({ title, onAddCard, saving }) {
    const [cardOption, setCardOption] = useState("not_selected");
    const navigate = useNavigate();

    return (
        <div className="flex bg-[white] shadow-md pr-10">
            <div className="flex">
                <button
                    className="px-6 py-3 border border-[#bebebe]"
                    onClick={() => navigate(-1)}
                >
                    <IoIosArrowRoundBack size={25} />
                </button>
                <div className="flex items-center justify-center text-[#585596] gap-4 px-3 py-1 border border-[#bebebe] border-l-0 font-semibold">
                    {/* <GoPlus size={25} /> */}
                    <select
                        value={cardOption}
                        onChange={(e) => {
                            if (e.target.value === "not_selected") return;
                            setCardOption(e.target.value);
                            onAddCard(e.target.value);
                        }}
                        className="border rounded-md px-2 py-1 border-[grey] outline-none cursor-pointer"
                    >
                        <option value={"not_selected"}>
                            Select card to add
                        </option>
                        <option value={"Landing"}>Landing</option>
                        <option value={"Checkout"}>Checkout</option>
                        <option value={"Thank You"}>Thank You</option>
                        <option value={"Custom card"}>Custom card</option>
                    </select>
                </div>
            </div>
            <div className="w-full flex items-center">
                <div className="flex gap-2 font-semibold ml-60">
                    <div>Workflow name : </div>
                    <div className="text-[#5d5c5c]">
                        {!title ? "Loading..." : title}
                    </div>
                </div>
                {saving && <div className="font-bold ml-auto">Saving...</div>}
            </div>
        </div>
    );
}

export function Workflow() {
    const { id } = useParams();
    const [saving, setSaving] = useState(false);

    const {
        setWid,
        popup,
        setPopup,
        title,
        description,
        setTitle,
        setDescription,
        cardId,
    } = useWorflowContext();

    const [workflow, setWorkflow] = useState(null);

    // for storing the position of the node that is currently being moved
    const currentMoving = useRef(null);

    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    const getCurrentWorkflow = useCallback(() => {
        const allWorkflow = JSON.parse(localStorage.getItem("workflows"));
        const currentWorkflow = allWorkflow.find(
            (workflow) => workflow.id === id
        );

        return { ...currentWorkflow };
    }, [id]);

    const updateWorkflow = useCallback(
        (updatedWorkflow) => {
            const allWorkflow = JSON.parse(localStorage.getItem("workflows"));
            const updatedWorkflows = allWorkflow.map((w) => {
                if (w.id === id) {
                    return updatedWorkflow;
                }
                return w;
            });

            localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
        },
        [id]
    );

    const onConnect = useCallback(
        (connection) => {
            const new_edge = {
                ...connection,
                animated: true,
                id: `${edges.length} + 1`,
                markerEnd: { type: MarkerType.ArrowClosed, color: "#1f4f9c" },
                style: {
                    strokeWidth: 2,
                    stroke: "#1f4f9c",
                },
            };

            setSaving(true);

            // save to localstorage
            const currentWorkflow = getCurrentWorkflow();
            currentWorkflow.edges.push(new_edge);

            updateWorkflow(currentWorkflow);

            setEdges((prevEdges) => addEdge(new_edge, prevEdges));
            setSaving(false);
        },
        [edges, setEdges, getCurrentWorkflow, updateWorkflow]
    );

    const onEdgesChange = (x) => {
        if (!x) return;
        const current = x[0];

        if (current.type === "remove") {
            setSaving(true);

            const currentWorkflow = getCurrentWorkflow();
            const e = currentWorkflow.edges.filter(
                (ed) => ed.id !== current.id
            );
            currentWorkflow.edges = e;
            updateWorkflow(currentWorkflow);

            setEdges(e);
            setSaving(false);
        }
    };

    const onNodesChange = (x) => {
        if (!x) return;
        const current = x[0];

        // get the final position of node after being dragged
        if (current.dragging === true) {
            currentMoving.current = current.position;
            setNodes((prev) => {
                return prev.map((p) => {
                    if (p.id === current.id)
                        return { ...p, position: currentMoving.current };
                    else return p;
                });
            });

            // update the node position in localstorage after dragging is stopped
        } else if (current.dragging === false) {
            if (!currentMoving.current) return;
            setSaving(true);

            const currentWorkflow = getCurrentWorkflow();
            currentWorkflow.cards = currentWorkflow.cards.map((c) => {
                if (c.id === current.id) {
                    return { ...c, position: currentMoving.current };
                } else return c;
            });
            //update workflow
            updateWorkflow(currentWorkflow);

            setSaving(false);

            // this event is fired when a node is removed, and the result of this event are the remaining nodes
        } else if (current.type === "reset") {
            const currentWorkflow = getCurrentWorkflow();

            const remainingNodes = x.map((c) => ({
                ...c.item,
                type: "card",
            }));
            const remainingCardIds = remainingNodes.map((c) => c.id);

            const cardRemoved = currentWorkflow.cards.filter(
                (c) => !remainingCardIds.includes(c.id)
            );

            // remove edges whose source is this 'removed card'
            const remainingEdges = currentWorkflow.edges.filter(
                (e) =>
                    e.source !== cardRemoved[0].id &&
                    e.target !== cardRemoved[0].id
            );

            setSaving(true);

            const currentUpdated = {
                ...currentWorkflow,
                cards: remainingNodes,
                edges: remainingEdges,
                steps: remainingNodes.length,
            };

            //update all workflows
            updateWorkflow(currentUpdated);

            setSaving(false);
            setNodes(remainingNodes);
        } else if (current.type === "remove") {
            setSaving(true);

            const currentWorkflow = getCurrentWorkflow();

            currentWorkflow.cards = [];
            currentWorkflow.steps = 0;

            //update all workflows
            updateWorkflow(currentWorkflow);

            setSaving(false);
            setNodes([]);
        }
    };

    const navigate = useNavigate();

    // Add new card
    const onAddCard = (card_type) => {
        const new_card = {
            id: uuidv4(),
            data: { type: card_type, title: card_type, description: "" },
            type: "card",
            position: { x: 0, y: 0 },
        };

        setSaving(true);

        const currentWorkflow = getCurrentWorkflow();

        currentWorkflow.cards = [...currentWorkflow.cards, new_card];
        currentWorkflow.steps = currentWorkflow.cards.length;

        //update all workflows
        updateWorkflow(currentWorkflow);

        setSaving(false);
        setNodes((prev) => [...prev, new_card]);
    };

    useEffect(() => {
        const findWorkflow = localStorage.getItem("workflows")
            ? JSON.parse(localStorage.getItem("workflows")).find(
                  (w) => w.id === id
              )
            : null;

        if (!findWorkflow) {
            navigate("/");
            return;
        }

        setWid(id);

        setWorkflow(findWorkflow);
        setNodes(findWorkflow.cards ? findWorkflow.cards : []);
        setEdges(findWorkflow.edges ? findWorkflow.edges : []);
    }, [navigate, id, setNodes, setEdges, setWid]);

    function handleEditCardDetail() {
        if (title.length < 3) {
            alert("Title too short");
            return;
        }

        const currentWorkflow = getCurrentWorkflow();

        const currentCards = currentWorkflow.cards.map((c) => {
            if (c.id === cardId) {
                return {
                    ...c,
                    data: { type: c.data.type, title, description },
                };
            } else return c;
        });

        currentWorkflow.cards = currentCards;

        //update all workflows
        updateWorkflow(currentWorkflow);

        setNodes((prev) => {
            return prev.map((p) => {
                if (p.id === cardId) {
                    return {
                        ...p,
                        data: { type: p.data.type, title, description },
                    };
                } else {
                    return p;
                }
            });
        });

        setPopup(false);
    }
    console.log("popup = ", popup);
    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            <Nav
                title={workflow?.title}
                onAddCard={onAddCard}
                saving={saving}
            />

            {workflow && (
                <Flow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                />
            )}
            <div
                className={`bg-[#ffffff] shadow-lg absolute inset-0 left-1/2 transition-all duration-300 ease-in-out ${
                    popup ? "translate-x-0" : "translate-x-[100%]"
                }`}
            >
                <div>
                    <div className="flex items-center border px-4 py-2 justify-between">
                        <h1 className="text-lg font-semibold text-[#332f62]">
                            Project Custom card
                        </h1>
                        <button
                            onClick={() => setPopup(false)}
                            className="text-[#332f62] hover:text-[#655dba]"
                        >
                            <IoCloseOutline size={25} />
                        </button>
                    </div>
                    <div>
                        <div className="px-4 py-4 flex flex-col gap-2">
                            <span className="text-lg">Card title</span>
                            <input
                                placeholder="Enter card title"
                                onChange={(e) => setTitle(e.target.value)}
                                value={title}
                                className="border test-sm outline-none px-2 py-2 rounded-md focus:outline-blue-200 outline-offset-0"
                            />
                        </div>
                        <div className="px-4 py-4 flex flex-col gap-2">
                            <span className="text-lg">
                                Card details{" "}
                                <span className="text-sm text-[#585757]">
                                    (something about the card)
                                </span>
                            </span>
                            <textarea
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                className="border h-[100px] test-sm outline-none px-2 py-2 rounded-md focus:outline-blue-200 outline-offset-0"
                                placeholder="What is this card about ?"
                            ></textarea>
                        </div>
                        <button
                            onClick={handleEditCardDetail}
                            className="font-semibold mx-4 text-md transition-all duration-200 ease-in-out hover:bg-[#302e42] bg-[#585596] text-[white] px-4 py-2 rounded-md"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const nodeTypes = {
    card: Card,
};

function Flow({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) {
    return (
        <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            selectionMode={SelectionMode.Partial}
        >
            <Controls />
            <MiniMap />
            <Background
                variant="dots"
                gap={12}
                size={1}
                style={{ backgroundColor: "#f7edff" }}
            />
        </ReactFlow>
    );
}
