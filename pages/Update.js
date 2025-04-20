import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "@/lib/supabase"

const UpdateClub = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [clubName,   setClubName]   = useState("")
  const [description,setDescription]= useState("")
  const [clubImage,  setClubImage]  = useState("")
  const [tags,       setTags]       = useState("")
  const [formError,  setFormError]  = useState(null)

  // Fetch the existing club on mount
  useEffect(() => {
    const fetchClub = async () => {
      const { data, error } = await supabase
        .from("clublists")
        .select()
        .eq("id", id)
        .single()

      if (error) {
        // if no such club, go back to Club List
        navigate("/", { replace: true })
      } else {
        setClubName(data.clubName)
        setDescription(data.description)
        setClubImage(data.clubImage)
        setTags(data.tags)
      }
    }

    fetchClub()
  }, [id, navigate])

  // Send the updates to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!clubName || !description || !clubImage || !tags) {
      setFormError("Please fill in all fields.")
      return
    }

    const { error } = await supabase
      .from("clublists")
      .update({ clubName, description, clubImage, tags })
      .eq("id", id)

    if (error) {
      console.error(error)
      setFormError("Could not update the club.")
    } else {
      setFormError(null)
      navigate("/")
    }
  }

  return (
    <div className="page update">
      <h2>Update Club</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="clubName">Club Name</label>
        <input
          id="clubName"
          type="text"
          value={clubName}
          onChange={e => setClubName(e.target.value)}
        />

        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <label htmlFor="clubImage">Club Image</label>
        <input
          id="clubImage"
          type="text"
          value={clubImage}
          onChange={e => setClubImage(e.target.value)}
        />

        <label htmlFor="tags">Tags</label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={e => setTags(e.target.value)}
        />

        <button type="submit">Update Club</button>
        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  )
}

export default UpdateClub
