import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase"; // Firestore config
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon

function Categorylist() {
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to control sidebar visibility

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoryCollectionRef = collection(db, "categories");
        const categorySnapshot = await getDocs(categoryCollectionRef);
        const categoryData = await Promise.all(
          categorySnapshot.docs.map(async (doc) => {
            const subcategoriesRef = collection(db, "categories", doc.id, "subcategories");
            const subcategorySnapshot = await getDocs(subcategoriesRef);
            const subcategories = subcategorySnapshot.docs.map((subDoc) => ({
              id: subDoc.id,
              ...subDoc.data(),
            }));
            return {
              id: doc.id,
              ...doc.data(),
              subcategories,
            };
          })
        );
        setCategories(categoryData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle click to toggle subcategories
  const toggleSubcategories = (categoryId) => {
    setActiveCategory(activeCategory === categoryId ? null : categoryId);
  };

  // Handle sidebar visibility toggle
  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="flex pl-2  ">
      {/* Toggle Button for Sidebar */}
      <div
        className="p-2 cursor-pointer fixed top-0 left- z-50 m-4"
        onClick={toggleSidebar}
      >
       {/* FontAwesome Hamburger Menu Icon */}
       <FontAwesomeIcon icon={faBars} size="2x" />
      </div>

      {/* Sidebar for Categories - visible when 'isSidebarVisible' is true */}
      {isSidebarVisible && (
        <div className="bg-white shadow-lg p-6 w-92 sticky top-0 h-screen">
          <h2 className="text-2xl pt-2 font-semibold  mb-6 ml-20">Shop by Category</h2>
          <ul className="space-y-6">
            {categories.map((category) => (
              <li key={category.id}>
                {/* Category Item */}
                <div
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-200 p-3 rounded-md transition duration-200 ease-in-out"
                  onClick={() => toggleSubcategories(category.id)}
                >
                  <div className="flex items-center">
                    <img
                      src={category.imageUrl}
                      alt={category.category}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <span className=" font-medium text-gray-800">
                      {category.category}
                    </span>
                  </div>
                  {/* Toggle + and - based on subcategory visibility */}
                  <span className="text-lg">
                    {activeCategory === category.id ? "-" : "+"}
                  </span>
                </div>

                {/* Subcategories - Toggle visibility on click */}
                {activeCategory === category.id && (
                  <ul className="pl-8 mt-3 space-y-2">
                    {category.subcategories.length > 0 ? (
                      category.subcategories.map((sub) => (
                        <li key={sub.id} className="flex items-center">
                          <img
                            src={sub.imageUrl}
                            alt={sub.subcategory}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <span className="text-gray-600 hover:text-blue-400">
                            {sub.subcategory}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No subcategories</li>
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Section with Banner */}
      <div className="flex-grow p-10 bg-cover bg-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-4 text-center">Welcome to Our Store</h2>
          <p className="text-center text-gray-600">
            Browse through our categories and discover amazing deals.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Categorylist;
