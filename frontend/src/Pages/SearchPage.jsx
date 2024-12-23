import React, { useState } from 'react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([
    { id: 1, username: 'darshan', fullName: 'darshan dhameliya' },
    { id: 2, username: 'anurag', fullName: 'anurag soni' },
    { id: 3, username: 'ronak', fullName: 'ronak rajput' },
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredResults = searchQuery
    ? searchResults.filter(
        (user) =>
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow-md bg-white">
      {/* Search Input */}
      <div className="flex items-center border rounded-md px-2 py-1">
        <input
          type="text"
          placeholder="Search a user"
          value={searchQuery}
          onChange={handleSearch}
          className="flex-grow outline-none px-2 text-sm"
        />
        <button className="text-gray-500 hover:text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m2.6-6.4a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
        </button>
      </div>

      {/* Search Results */}
      <div className="mt-4">
        {filteredResults.length > 0 ? (
          filteredResults.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 py-2 border-b last:border-none"
            >
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-bold">{user.username}</p>
                <p className="text-xs text-gray-500">{user.fullName}</p>
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <p className="text-sm text-gray-500 text-center">No results found.</p>
        ) : (
          <p className="text-sm text-gray-500 text-center">Start typing to search for users.</p>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
