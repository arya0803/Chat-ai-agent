import React, { use, useContext , useEffect , useState } from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [project, setProject] = useState([]);
  const navigate = useNavigate();

  function createProject(e) {
    e.preventDefault();
    console.log(projectName)
    axios.post('/projects/create', { 
      name: projectName 
    }).then((res) => {
        console.log(res.data);
        setIsModalOpen(false);
    }).catch((err) => {
      console.error(err);
    })
  }

  useEffect(() =>{
    axios.get('/projects/all').then((res) => {
      setProject(res.data.projects);
    }).catch((err) => {
      console.error(err);
    })
  } , []);
  return (

    <main className='p-4 '>

      <div className="projects flex flex-wrap gap-4" >
        <button className="project border-2 p-2 rounded-3xl cursor-pointer" onClick={() =>{setIsModalOpen(true)}}> NEW PROJECT
          <i className="ri-link ml-2"></i>
        </button>
        {
          project.map((project) => (
            <div key={project._id} 
            onClick={() => { navigate(`/project`,{
              state : {project}
            }) }}
            className="project border-2 p-2 rounded-3xl cursor-pointer min-w-52 hover:bg-gray-500">
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <div className="flex flex-wrap gap-4"> 
                <p><i className="ri-user-line"></i> <small>Collaborators :</small> </p>
                {project.users.length}
              </div>
            </div>
          ))
        }
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Project</h2>

            <form onSubmit={createProject}>

              <label className="block mb-2 text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input 
                onChange={(e) => setProjectName(e.target.value)}
                value={projectName}
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>

  )
}

export default Home
