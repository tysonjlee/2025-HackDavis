// app/createClub/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase }  from "@/lib/supabase";

export default function CreateClubPage() {
  const router = useRouter();

  // form state
  const [clubName,    setClubName]    = useState("");
  const [description, setDescription] = useState("");
  const [tags,        setTags]        = useState("");
  const [file,        setFile]        = useState<File | null>(null);
  const [formError,   setFormError]   = useState<string | null>(null);
  const [uploading,   setUploading]   = useState(false);

  // file picker handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  // submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubName || !description || !tags || !file) {
      setFormError("Please fill in all fields and select an image.");
      return;
    }

    setUploading(true);

    // upload image to Supabase Storage
    const ext      = file.name.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `public/${fileName}`;

    const { error: upErr } = await supabase
      .storage
      .from("club-images")
      .upload(filePath, file, { cacheControl: "3600", upsert: false });

    if (upErr) {
      setFormError("Image upload failed.");
      setUploading(false);
      return;
    }

    // get public URL
    const { data: urlData } = supabase
      .storage
      .from("club-images")
      .getPublicUrl(filePath);
    const imageUrl = urlData.publicUrl;

    // insert club record
    const { error: insErr } = await supabase
      .from("clublists")
      .insert([{
        club_name:  clubName,
        description,
        club_image: imageUrl,
        tags
      }]);

    setUploading(false);

    if (insErr) {
      setFormError("Could not create club.");
    } else {
      router.push("/clubLists");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Create a Club
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {/* Club Name */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="clubName" className="font-medium text-gray-700">
              Club Name
            </label>
            <input
              id="clubName"
              type="text"
              value={clubName}
              onChange={e => setClubName(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#12bca2]"
            />
          </div>

          {/* Description: spans right column */}
          <div className="flex flex-col space-y-1 sm:row-span-3">
            <label htmlFor="description" className="font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={8}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#12bca2] resize-none"
            />
          </div>

          {/* Club Image */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="clubImageFile" className="font-medium text-gray-700">
              Club Image
            </label>
            <input
              id="clubImageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#12bca2]"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col space-y-1">
            <label htmlFor="tags" className="font-medium text-gray-700">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#12bca2]"
            />
          </div>

          {/* Submit button spans both columns */}
          <button
            type="submit"
            disabled={uploading}
            className="sm:col-span-2 mt-4 bg-[#12bca2] text-white font-semibold py-3 rounded-lg hover:bg-opacity-90 transition"
          >
            {uploading ? "Uploading…" : "Create Club"}
          </button>

          {formError && (
            <p className="sm:col-span-2 text-red-600 mt-2">{formError}</p>
          )}
        </form>
      </div>
    </div>
  );
}
