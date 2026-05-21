import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CulturalPlatformFooter from "../components/CulturalPlatformFooter";

const CommunityForm = () => {
  const { logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [language, setLanguage] = useState("mr");

  const marathi = {
    pageTitle: "सामुदायिक ज्ञान केंद्र",
    pageDescription: "महाराष्ट्राची संस्कृती, परंपरा, पाकविधी आणि कथांचे तुमचे ज्ञान सामायिक करा.",
    titleLabel: "शीर्षक",
    titlePlaceholder: "उदा. पारंपरिक कोल्हापुरी चप्पल बनवणे",
    categoryLabel: "प्रकार",
    locationLabel: "Location",
    locationPlaceholder: "उदा. कोल्हापूर, मुंबई",
    contentLabel: "सामग्री",
    contentPlaceholder: "तुमचे ज्ञान तपशील म्हणून शेअर करा...",
    imageLabel: "प्रतिमा जोडा (ऐच्छिक)",
    imageText: "प्रतिमा अपलोड करण्यासाठी क्लिक करा (PNG, JPG, 5MB पर्यंत)",
    previewLabel: "प्रतिमा पूर्वावलोकन",
    submitButton: "ज्ञान सामायिक करा",
    viewContributionsButton: "योगदान पाहा",
    logoutButton: "बाहेर पडा",
    readEnglish: "Read in English",
    categories: [
      { value: "", label: "निवड करा" },
      { value: "कथा", label: "कथा" },
      { value: "पाककृती", label: "पाककृती" },
      { value: "हस्तकला", label: "हस्तकला" },
      { value: "लोककला", label: "लोककला" }
    ]
  };

  const english = {
    pageTitle: "Community Knowledge Hub",
    pageDescription: "Share your knowledge of Maharashtra's culture, traditions, cuisine, and stories.",
    titleLabel: "Title",
    titlePlaceholder: "e.g., Making traditional Kolhapuri chappals",
    categoryLabel: "Category",
    locationLabel: "Location",
    locationPlaceholder: "e.g., Kolhapur, Mumbai",
    contentLabel: "Content",
    contentPlaceholder: "Share your knowledge in detail...",
    imageLabel: "Add Images (Optional)",
    imageText: "Click to upload images (PNG, JPG up to 5MB)",
    previewLabel: "Image Preview",
    submitButton: "Share Knowledge",
    viewContributionsButton: "View Contributions",
    logoutButton: "Logout",
    readEnglish: "मराठीत वाचा",
    categories: [
      { value: "", label: "Select" },
      { value: "Story", label: "Story" },
      { value: "Recipe", label: "Recipe" },
      { value: "Handicraft", label: "Handicraft" },
      { value: "Folk Art", label: "Folk Art" }
    ]
  };

  const text = language === "mr" ? marathi : english;

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (e) => {
    const selectedImages = Array.from(e.target.files);
    setImages(selectedImages);
    
    // Show feedback to user
    if (selectedImages.length > 0) {
      setMessage(`📸 ${selectedImages.length} image(s) selected`);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      // Create FormData to handle file uploads
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('location', location);
      formData.append('content', content);
      
      // Add each image to FormData
      images.forEach((image) => {
        formData.append('images', image);
      });
      
      await axios.post(
        "http://localhost:5000/api/community/add",
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      setMessage("✅ Contribution submitted successfully!");
      setTimeout(() => {
        setTitle("");
        setCategory("");
        setLocation("");
        setContent("");
        setImages([]);
      }, 1000);
    } catch (err) {
      setMessage("⚠️ Failed to submit contribution");
      console.error("Submission error:", err);
    }
  };

  return (
    <div className="bg-[#fff8f3] min-h-screen font-['Public_Sans'] flex flex-col">

      

      {/* ------------------ PAGE TITLE ------------------ */}
      <header className="text-center py-10 px-6 bg-[#fff8f3]">
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === "mr" ? "english" : "mr")}
          className="mb-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
        >
          {language === "mr" ? "English" : "मराठी"}
        </button>

        <h1 className="text-4xl font-extrabold text-[#222] mb-2">
          {text.pageTitle}
        </h1>
        <p className="text-gray-700 max-w-3xl mx-auto text-lg leading-relaxed">
          {text.pageDescription}
        </p>
      </header>

      {/* ------------------ FORM ------------------ */}
      <main className="max-w-3xl mx-auto p-6 w-full">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white rounded-2xl shadow-md p-8 border border-orange-100"
        >
          {message && <p className="text-center text-green-600">{message}</p>}

          <div>
            <label className="font-semibold text-gray-800">{text.titleLabel}</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={text.titlePlaceholder}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-orange-300 outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[45%]">
              <label className="font-semibold text-gray-800">{text.categoryLabel}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-orange-300 outline-none"
              >
                {text.categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-[45%]">
              <label className="font-semibold text-gray-800">{text.locationLabel}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={text.locationPlaceholder}
                className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-orange-300 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-gray-800">{text.contentLabel}</label>
            <textarea
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={text.contentPlaceholder}
              className="w-full border border-gray-300 rounded-md px-4 py-2 mt-1 focus:ring-2 focus:ring-orange-300 outline-none"
            ></textarea>
          </div>

          <div>
            <label className="font-semibold text-gray-800">{text.imageLabel}</label>
            <div className="mt-2 border-2 border-dashed border-orange-300 rounded-lg p-6 text-center bg-orange-50 hover:bg-orange-100 transition">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full text-sm"
              />
              <p className="text-sm mt-2">{text.imageText}</p>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="mt-4">
                <label className="font-semibold text-gray-800">{text.previewLabel}</label>
                <div className="flex flex-wrap gap-3 mt-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`Preview ${i + 1}`}
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = images.filter((_, index) => index !== i);
                          setImages(newImages);
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#e36414] text-white font-semibold py-3 rounded-md shadow-md hover:bg-[#d4580d] transition"
          >
            {text.submitButton}
          </button>
        </form>
      </main>

      {/* Logout Button */}
      <div className="flex justify-between p-4">
        <Link
          to="/contribution"
          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
        >
          {text.viewContributionsButton}
        </Link>
        <button
          onClick={() => {
            logout();
            navigate("/login", { replace: true });
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
        >
          {text.logoutButton}
        </button>
      </div>

      {/* ------------------ FOOTER ------------------ */}
      <CulturalPlatformFooter />
    </div>
  );
};

export default CommunityForm;
