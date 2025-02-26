import React, { useState, useEffect } from 'react';
import { storage, db } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function SubcategoryForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const categoryList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryList);
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setSubcategoryImage(e.target.files[0]);
  };

  const handleAddSubcategory = async () => {
    if (!subcategoryName || !selectedCategory || !subcategoryImage) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `subcategories/images/${subcategoryImage.name}`);
      const uploadTask = uploadBytesResumable(imageRef, subcategoryImage);

      uploadTask.on(
        'state_changed',
        null,
        (error) => toast.error("Image upload failed."),
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add subcategory to Firestore with image URL
          await addDoc(collection(db, 'categories', selectedCategory, 'subcategories'), {
            subcategory: subcategoryName,
            imageUrl, // Store image URL in Firestore
            createdAt: new Date(),
          });

          setSubcategoryName("");
          setSelectedCategory("");
          setSubcategoryImage(null);

          toast.success("Subcategory added successfully!");
          navigate("/productform");
        }
      );
    } catch (error) {
      toast.error("Error adding subcategory.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{ backgroundImage: 'url("/images/react.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Subcategory</h2>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mb-2 p-2 w-full border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.category}</option>
          ))}
        </select>

        <input
          type="text"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
          placeholder="Subcategory Name"
          className="mb-2 p-2 w-full border rounded"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2 p-2 w-full border rounded"
        />

        <button
          onClick={handleAddSubcategory}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Add Subcategory
        </button>

        <ToastContainer />
      </div>
    </div>
  );
}

export default SubcategoryForm;
