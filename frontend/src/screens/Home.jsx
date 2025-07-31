import React, { useContext } from 'react'
import { UserContext } from '../context/user.context'
import axios from '../config/axios';

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [projectName, setProjectName] = React.useState(null);

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
  return (

    <main className='p-4 '>

      <div className="projects">
        <button className="project border-2 p-2 rounded-3xl cursor-pointer" onClick={() =>{setIsModalOpen(true)}}> NEW PROJECT
          <i className="ri-link ml-2"></i>
        </button>
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
