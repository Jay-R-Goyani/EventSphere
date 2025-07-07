import React, { useState } from 'react';

const TagSelector = ({ selectedTags = [], onTagChange }) => {
  const [inputValue, setInputValue] = useState('');
  const options = [
    'Coding', 'Workshop', 'Career Fair',
    'Cultural Festival', 'Music', 'Theater',
    'Orientation', 'Party', 'Club Fair',
    'Resume Building', 'Networking', 'Leadership',
    'Intramural', 'Fitness', 'Tournament',
    'Social Justice', 'Mental Health', 'Diversity',
    'Game Night', 'Trivia', 'Talent Show'
  ];

  const handleSelect = (event) => {
    const value = event.target.value;
    if (value && !selectedTags.includes(value)) {
      const updatedTags = [...selectedTags, value];
      onTagChange(updatedTags);
      setInputValue('');
    }
  };

  const removeTag = (tag) => {
    const updatedTags = selectedTags.filter((t) => t !== tag);
    onTagChange(updatedTags);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-6 bg-gray-900 border border-gray-800 rounded-xl shadow-lg p-4 flex flex-col gap-2">
      <select
        value={inputValue}
        onChange={handleSelect}
        className="bg-gray-800 text-yellow-400 px-4 py-2 rounded-lg outline-none border-none focus:ring-2 focus:ring-yellow-400 transition-all w-full mb-2"
      >
        <option value="" disabled>Select tags...</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-gray-900 text-yellow-400">{option}</option>
        ))}
      </select>
      <div className="flex flex-wrap gap-2 mt-2">
        {selectedTags.map((tag) => (
          <span key={tag} className="flex items-center bg-yellow-400 text-gray-900 px-3 py-1 rounded-full font-semibold text-sm shadow hover:bg-yellow-500 transition-colors">
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-2 text-gray-700 hover:text-red-600 font-bold text-lg focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;