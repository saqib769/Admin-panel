import React, { useState } from 'react';
import { db, storage } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Category() {
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const navigate = useNavigate()

  const handleAddCategory = async () => {
    if (newCategory.trim() === "" || !categoryImage) {
      toast.error("Please provide a category name and an image.");
      return;
    }

    try {
      // Upload category image to Firebase Storage
      const storageRef = ref(storage, `category/Images/${categoryImage.name}`);
      await uploadBytes(storageRef, categoryImage);
      const imageUrl = await getDownloadURL(storageRef);

      // Add new category to Firestore
      await addDoc(collection(db, "categories"), {
        category: newCategory,
        imageUrl, // Save image URL
        createdAt: new Date(),
      });

      // Clear inputs after successful addition
      setNewCategory("");
      setCategoryImage(null);
      toast.success(`Category "${newCategory}" added successfully!`);

      // Optional: Show the added category details
      console.log(`Added Category: ${newCategory}, Image URL: ${imageUrl}`);
      navigate("/subcategory")
      
    } catch (e) {
      console.error("Error adding category: ", e);
      toast.error("Failed to add category.");
    }
  };

  return (
    <div
    className="flex justify-center items-center min-h-screen bg-gray-100"
    style={{ backgroundImage: 'url("/images/react.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
  >
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Add New Category</h2>

        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter category name"
          className="block w-full mb-4 p-3 border border-gray-300 rounded-md shadow-sm"
        />

        <input
          type="file"
          accept="image/*" // Accept only image files
          onChange={(e) => setCategoryImage(e.target.files[0])}
          className="block w-full mb-4 p-3 border border-gray-300 rounded-md shadow-sm"
        />

        <button
          onClick={handleAddCategory}
          className="bg-blue-500 w-full text-white py-3 px-4 rounded-md shadow-md hover:bg-blue-600 transition duration-300"
        >
          Add Category
        </button>

        <ToastContainer />
      </div>
    </div>
  );
}

export default Category;
