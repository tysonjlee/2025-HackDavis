import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

// swap in your ClubCard component (make sure you have one!)
import ClubCard from "../components/ui/ClubCard"

const ClubList = () => {
  const [fetchError, setFetchError] = useState(null)
  const [clubs,      setClubs]      = useState(null)
  const [orderBy,    setOrderBy]    = useState("created_at")

  const handleDelete = (id) => {
    setClubs(prev => prev.filter(c => c.id !== id))
  }

  useEffect(() => {
    const fetchClubs = async () => {
      const { data, error } = await supabase
        .from("clublists")
        .select()
        .order(orderBy, { ascending: false })

      if (error) {
        setFetchError("Could not fetch the clubs")
        setClubs(null)
      } else {
        setClubs(data)
        setFetchError(null)
      }
    }

    fetchClubs()
  }, [orderBy])

  return (
    <div className="page club-list">
      {fetchError && <p className="error">{fetchError}</p>}

      {clubs && (
        <div className="clubs">
          <div className="order-by">
            <p>Order by:</p>
            <button onClick={() => setOrderBy("created_at")}>
              Time Created
            </button>
            <button onClick={() => setOrderBy("clubName")}>
              Club Name
            </button>
            <button onClick={() => setOrderBy("tags")}>
              Tags
            </button>
          </div>

          <div className="club-grid">
            {clubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ClubList
