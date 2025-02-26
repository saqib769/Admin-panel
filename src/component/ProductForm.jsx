import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase'; // Adjust based on your Firebase config
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductForm() {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categorySnapshot = await getDocs(collection(db, 'categories'));
        const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryList);
      } catch (error) {
        toast.error("Error fetching categories.");
      }
    };

    fetchCategories();
  }, []);

  // Fetch Subcategories based on selectedCategory
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (selectedCategory) {
        try {
          const subcategorySnapshot = await getDocs(collection(db, `categories/${selectedCategory}/subcategories`));
          const subcategoryList = subcategorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setSubcategories(subcategoryList);
        } catch (error) {
          toast.error("Error fetching subcategories.");
        }
      } else {
        setSubcategories([]);
        setSelectedSubcategory(""); // Reset subcategory when category is changed
      }
    };

    fetchSubcategories();
  }, [selectedCategory]);

  const handleImageChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleAddProduct = async () => {
    if (!productName || !productDescription || !productPrice || !productImage || !selectedSubcategory) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `products/images/${productName}`);
      const uploadTask = uploadBytesResumable(imageRef, productImage);

      uploadTask.on(
        'state_changed',
        null,
        (error) => {
          console.error("Image upload error:", error);
          toast.error("Image upload failed.");
        },
        async () => {
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);

          // Add product to Firestore with image URL and selected subcategory ID
          await addDoc(collection(db, 'products'), {
            productName,
            productDescription,
            productPrice,
            imageUrl, // Store image URL in Firestore
            subcategoryId: selectedSubcategory, // Save selected subcategory ID
            categoryId: selectedCategory, // Save selected category ID
          });

          // Clear fields after successful addition
          setProductName("");
          setProductDescription("");
          setProductPrice("");
          setProductImage(null);
          setSelectedCategory(""); // Reset selected category
          setSelectedSubcategory(""); // Reset selected subcategory
          setSubcategories([]); // Reset subcategories

          toast.success("Product added successfully!");
        }
      );
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-gray-100"
      style={{ backgroundImage: 'url("/images/react.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Add New Product</h2>

        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Product Name"
          className="mb-2 p-2 w-full border rounded"
        />

        <textarea
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
          placeholder="Product Description"
          className="mb-2 p-2 w-full border rounded"
        />

        <input
          type="number"
          value={productPrice}
          onChange={(e) => setProductPrice(e.target.value)}
          placeholder="Product Price"
          className="mb-2 p-2 w-full border rounded"
        />

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="mb-2 p-2 w-full border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.category}
            </option>
          ))}
        </select>

        {/* Subcategory Dropdown */}
        <select
          value={selectedSubcategory}
          onChange={(e) => setSelectedSubcategory(e.target.value)}
          className="mb-2 p-2 w-full border rounded"
          disabled={!subcategories.length} // Disable if no subcategories are available
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.subcategory} {/* Ensure this matches your subcategory field */}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-2 p-2 w-full border rounded"
        />

        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Add Product
        </button>

        <ToastContainer />
      </div>
    </div>
  );
}

export default ProductForm;
