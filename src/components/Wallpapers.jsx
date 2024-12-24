import React, { useEffect, useState } from 'react';
import axios from 'axios';
import mount from '../components/mount.png';

const Wallpapers = () => {
  // const apiKEY = 'gNJhOjpSIMjLCRlprgDP02RyHdii4zrQ1ocQu_nzQmE';

  const [tags, setTags] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('nature'); // Separate state for category
  const [wallData, setWallData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [modalImage, setModalImage] = useState(null);
// console.log(import.meta.env.VITE_API_KEY)
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
    setTags(e.target.value); // Only update tags when typing
  };

  const handleSearch = () => {
    if (tags.trim()) {
      setSelectedCategory(''); // Clear selected category when searching manually
      setCurrentPage(1);
      getData(tags, 1);
    }
  };

  const handleCategoryClick = (category) => {
    setTags(''); // Clear search input
    setSelectedCategory(category); // Update category state
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
      <div className="bg-violet-500 bg-opacity-5 w-[100%] shadow shadow-violet-500 h-[60px] flex justify-between items-center px-4">
        {/* Navigation Links */}
        <div className="flex gap-4">
          <button
            onClick={() => handleCategoryClick('Manga')}
            className="text-white hover:text-violet-400"
          >
            Manga
          </button>
          <button
            onClick={() => handleCategoryClick('Nature')}
            className="text-white hover:text-violet-400"
          >
            Nature
          </button>
          <button
            onClick={() => handleCategoryClick('Cars')}
            className="text-white hover:text-violet-400"
          >
            Cars
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center">
          <input
            placeholder="Search for Images"
            onChange={handleOnChange}
            value={tags} // Bind only to the input field
            type="text"
            className="w-[300px] p-2 rounded placeholder:pl-2"
          />
          <button onClick={handleSearch} className="bg-cyan-400 p-2 ml-2 rounded">
            Search
          </button>
        </div>

        {/* Logo */}
        <div>
          <img className="w-[50px] h-[50px] object-cover shadow" src={mount} alt="Logo" />
        </div>
      </div>

      {/* Image Gallery */}
      <div className="flex flex-col items-center mt-4">
        <div className="grid grid-cols-5 gap-4">
          {wallData.map((elem, indx) => (
            <div key={indx} className="relative group">
              <img
                src={elem.urls.small}
                alt=""
                className="w-full h-[150px] object-cover rounded shadow cursor-pointer group-hover:scale-110 transition-transform"
                onClick={() => handleImageClick(elem.urls.full)} // Open modal with full-resolution image
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            className={`text-white bg-cyan-300 p-2 rounded-sm ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handlePreviousPage}
          >
            Previous
          </button>
          <button
            disabled={currentPage === totalPages}
            className={`text-white bg-cyan-500 p-2 rounded-sm ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleNextPage}
          >
            Next
          </button>
        </div>

        <p className="text-white mt-2">
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
            <img src={modalImage} alt="Full Size" className="max-w-[90vw] max-h-[90vh]" />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 bg-opacity-55 rounded p-2 px-4"
            >
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Wallpapers;
