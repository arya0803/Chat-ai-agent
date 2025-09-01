import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer'
import {
    FaBars,
    FaTerminal,
    FaPlay,
    FaStop,
    FaUsers,
    FaPlus,
    FaTimes,
    FaArrowLeft,
    FaChevronDown,
    FaChevronRight,
    FaCode,
    FaFileAlt,
    FaSave,
    FaSpinner,
    FaWifi,
    FaExclamationTriangle
} from 'react-icons/fa';

function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}

const Project = () => {

    const location = useLocation()
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set()) // Initialized as Set
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()
    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]) // New state variable for messages
    const [fileTree, setFileTree] = useState({})
    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])
    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)
    const [runProcess, setRunProcess] = useState(null)
    const navigate = useNavigate()

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }
            return newSelectedUserId;
        });
    }

    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)
        }).catch(err => {
            console.log(err)
        })
    }

    const send = () => {
        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }]) // Update messages state
        setMessage("")
    }

    function WriteAiMessage(message) {
        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={message.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {
        initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }

        receiveMessage('project-message', data => {
            console.log(data)

            if (data.sender._id == 'ai') {
                const message = data.message;
                console.log(message)
                webContainer?.mount(message.fileTree)

                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [...prevMessages, data]) // Update messages state
            } else {
                setMessages(prevMessages => [...prevMessages, data]) // Update messages state
            }
        })

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            console.log(res.data.project)
            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.log(err)
        })

    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
            {/* Sidebar / File Explorer */}
           

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <div className="bg-gray-800 border-b border-indigo-700 p-3 flex justify-between items-center shadow-lg">
                    <div className="flex items-center space-x-4">
                       
                        <button onClick={() => navigate('/')} className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white transition-colors duration-200 flex items-center space-x-2 shadow-md">
                            <FaArrowLeft /> <span className="hidden sm:inline">Back to Projects</span>
                        </button>
                        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 ml-4">
                            {project.name}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            <FaUsers /> <span className="hidden sm:inline">Add Collaborator</span>
                        </button>
                    </div>
                </div>

                {/* Editor & Preview Area */}
               

                {/* Chat and Collaborators Sidebar */}
                <div className='p-4 border-b border-indigo-700 flex justify-between items-center'>
                    <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        <FaUsers className="inline-block mr-2" /> Collaborators & Chat
                    </h3>

                </div>

                <div className='flex-1 flex flex-col p-4 overflow-y-auto custom-scrollbar'>
                    <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
                        <div
                            ref={messageBox}
                            className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full custom-scrollbar-hide">
                            {messages.map((msg, index) => (
                                <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id === user._id.toString() && 'ml-auto'} message flex flex-col p-2 bg-slate-50 w-fit rounded-md text-black`}>
                                    <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                    <div className='text-sm'>
                                        {msg.sender._id === 'ai' ?
                                            WriteAiMessage(msg.message)
                                            : <p>{msg.message}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="inputField w-full flex absolute bottom-0">
                            <input
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className='p-2 px-4 border-none outline-none flex-grow text-black' type="text" placeholder='Enter message' />
                            <button
                                onClick={send}
                                className='px-5 bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                        </div>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
                        <div className="bg-gray-800 rounded-lg p-8 shadow-2xl w-full max-w-lg border border-purple-600 transform transition-all duration-300 scale-100 hover:scale-105">
                            <h2 className="text-3xl font-bold text-white mb-6 text-center">Add Collaborators</h2>
                            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar mb-6">
                                {users.map(user => (
                                    <label key={user._id} className="flex items-center text-lg text-gray-200 cursor-pointer p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-5 w-5 text-purple-600 rounded border-gray-500 focus:ring-purple-500 transition duration-150 ease-in-out"
                                            checked={selectedUserId.has(user._id)}
                                            onChange={() => handleUserClick(user._id)}
                                        />
                                        <span className="ml-3">{user.email}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex justify-between space-x-4">
                                <button
                                    onClick={() => { setIsModalOpen(false); setSelectedUserId(new Set()) }}
                                    className="flex-1 py-3 px-6 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors duration-300 shadow-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addCollaborators}
                                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Add Collaborators
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Project