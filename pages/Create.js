import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

const Create = () => {
  const navigate = useNavigate()

  const [clubName, setClubName] = useState('')
  const [description, setDescription] = useState('')
  const [clubImage, setClubImage] = useState('')
  const [tags, setTags] = useState('')
  const [formError, setFormError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!clubName || !description || !clubImage || !tags) {
      setFormError('Please fill in all the fields correctly.')
      return
    }

    const { data, error } = await supabase
      .from('clublists')
      .insert([{ clubName, description, clubImage, tags }])

    if (error) {
      console.log(error)
      setFormError('Please fill in all the fields correctly.')
    }
    if (data) {
      console.log(data)
      setFormError(null)
      navigate('/')
    }
  }

  return (
    <div className="page create">
      <h2>Create a Club</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="Club Name">Club Name:</label>
        <input 
          type="text" 
          id="Club Name"
          value={clubName}
          onChange={(e) => setClubName(e.target.value)}
        />

        <label htmlFor="Description">Description:</label>
        <textarea 
          id="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label htmlFor="Club Image">Club Image:</label>
        <input 
          type="text"
          id="Club Image"
          value={clubImage}
          onChange={(e) => setClubImage(e.target.value)}
        />

        <label htmlFor="Tags">Tags:</label>
        <input 
          type="text"
          id="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button>Create Smoothie Recipe</button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default Create