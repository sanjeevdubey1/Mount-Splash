import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mount from '../components/mount.png';

const Wallpapers = () => {
  const [tags, setTags] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('nature');
  const [wallData, setWallData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalImage, setModalImage] = useState(null);

  const getData = async (query = tags || selectedCategory, page = 1) => {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query: query,
        per_page: 25,
        page: page,
        orientation: 'landscape',
      },
      headers: {
        Authorization: `Client-ID ${import.meta.env.VITE_API_KEY}`,
      },
    });
    setTotalPages(response.data.total_pages);
    setWallData(response.data.results);
  };

  useEffect(() => {
    getData(selectedCategory || tags, currentPage);
  }, [currentPage, selectedCategory]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleOnChange = (e) => {
    setTags(e.target.value);
  };

  const handleSearch = () => {
    if (tags.trim()) {
      setSelectedCategory('');
      setCurrentPage(1);
      getData(tags, 1);
    }
  };

  const handleCategoryClick = (category) => {
    setTags('');
    setSelectedCategory(category);
    setCurrentPage(1);
    getData(category, 1);
  };

  const handleImageClick = (image) => {
    setModalImage(image);
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <>
      {/* Header Section */}
      <div className="bg-blue-gray-900 w-full h-16 flex justify-between items-center px-6 shadow-md">
        {/* Navigation Links */}
        <div className="flex gap-6">
          <button
            onClick={() => handleCategoryClick('Manga')}
            className="text-teal-300 hover:text-teal-500 text-lg font-medium transition-colors"
          >
            Manga
          </button>
          <button
            onClick={() => handleCategoryClick('Nature')}
            className="text-teal-300 hover:text-teal-500 text-lg font-medium transition-colors"
          >
            Nature
          </button>
          <button
            onClick={() => handleCategoryClick('Cars')}
            className="text-teal-300 hover:text-teal-500 text-lg font-medium transition-colors"
          >
            Cars
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center">
          <input
            placeholder="Search for Images"
            onChange={handleOnChange}
            value={tags}
            type="text"
            className="w-64 p-2 rounded-md bg-blue-gray-700 text-black placeholder-gray-400 focus:ring-2 focus:ring-teal-500 outline-none"
          />
          <button
            onClick={handleSearch}
            className="ml-3 bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition"
          >
            Search
          </button>
        </div>

        {/* Logo */}
        <div>
          <img className="w-12 h-12 object-cover rounded-full shadow-lg" src={mount} alt="Logo" />
        </div>
      </div>

      {/* Image Gallery */}
      <div className="flex flex-col items-center mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4">
          {wallData.map((elem, indx) => (
            <div key={indx} className="relative group">
              <img
                src={elem.urls.small}
                alt=""
                className="w-full h-40 object-cover rounded-md shadow-md group-hover:scale-105 transition-transform cursor-pointer"
                onClick={() => handleImageClick(elem.urls.full)}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex gap-6 mt-8">
          <button
            disabled={currentPage === 1}
            className={`text-white bg-blue-gray-700 px-4 py-2 rounded-md font-medium hover:bg-blue-gray-600 transition ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            className={`text-white bg-teal-500 px-4 py-2 rounded-md font-medium hover:bg-teal-600 transition ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>

        <p className="text-white mt-4">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      {/* Modal for Full-Size Image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div className="relative">
            <img src={modalImage} alt="Full Size" className="max-w-[90vw] max-h-[90vh] rounded-md" />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-teal-500 bg-opacity-75 rounded-md px-4 py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Wallpapers;
