import React from 'react';

const SearchBar = ({ formSubmit, value, handleSearchKey, clearSearch }) => (
  <div className="w-full max-w-xl mx-auto my-10">
    <form onSubmit={formSubmit} className="flex items-center bg-gray-900 rounded-full shadow-lg px-4 py-2 border border-gray-800">
      <svg className="w-5 h-5 text-yellow-400 mr-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
      <input
        type="text"
        placeholder="Search by category..."
        value={value}
        onChange={handleSearchKey}
        className="flex-grow bg-transparent outline-none text-white placeholder-gray-400 px-2 py-2 text-base"
      />
      {value && (
        <button type="button" onClick={clearSearch} className="ml-2 text-gray-400 hover:text-red-400 transition-colors text-lg font-bold" aria-label="Clear search">&times;</button>
      )}
      <button type="submit" className="ml-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-2 rounded-full transition-colors shadow">
        Go
      </button>
    </form>
  </div>
);

export default SearchBar;
