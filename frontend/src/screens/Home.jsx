import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaCode, FaUsers, FaFolderOpen } from 'react-icons/fa';

const Home = () => {
    const { user } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get('/projects/all');
                setProjects(res.data.projects);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            }
        };
        fetchProjects();
    }, []);

    const createProject = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/projects/create', { name: projectName });
            setIsModalOpen(false);
            setProjectName('');
            const res = await axios.get('/projects/all');
            setProjects(res.data.projects);
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-6 sm:p-10">
            <header className="flex justify-between items-center mb-10 pb-4 border-b border-purple-700">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 drop-shadow-lg">
                    Your Projects
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-full shadow-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
                >
                    <FaPlus className="text-xl" />
                    <span className="hidden sm:inline-block">New Project</span>
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.length === 0 ? (
                    <p className="col-span-full text-center text-lg text-gray-400 py-10">
                        No projects found. Start by creating a new one!
                    </p>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project._id}
                            onClick={() => {
                                navigate(`/project`, { state: { project } });
                            }}
                            className="bg-purple-800 bg-opacity-40 backdrop-filter backdrop-blur-sm rounded-xl p-6 shadow-xl border border-purple-700 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-purple-500 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-2xl font-bold text-indigo-300 group-hover:text-indigo-200 flex items-center">
                                    <FaFolderOpen className="mr-3 text-purple-400 text-3xl" />
                                    {project.name}
                                </h3>
                                <FaCode className="text-4xl text-green-400 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="flex items-center text-gray-300 text-lg">
                                <FaUsers className="mr-2 text-yellow-400" />
                                {project.users?.length || 0} Collaborators
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-gray-800 rounded-lg p-8 shadow-2xl w-full max-w-md border border-indigo-600 transform transition-all duration-300 scale-100 hover:scale-105">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text"
                                    className="w-full px-5 py-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-indigo-500 focus:ring-4 focus:ring-indigo-400 focus:border-transparent outline-none transition duration-300"
                                    required
                                />
                            </div>
                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    className="flex-1 py-3 px-6 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors duration-300 shadow-md"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;