import React, { useState } from "react";
import "./TagsSelector.css"; 

const TagsSelector = ({ tags = [], onChange }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    let newSelected;
    if (selectedTags.includes(tag)) {
      newSelected = selectedTags.filter((item) => item !== tag);
    } else {
      newSelected = [...selectedTags, tag];
    }
    setSelectedTags(newSelected);
    if (onChange) {
      onChange(newSelected);
    }
  };

  return (
    <div className="tags-container">
      {tags.map((tag, index) => (
        <span
          key={index}
          className={`item-tag ${selectedTags.includes(tag) ? "selected" : ""}`}
          onClick={() => toggleTag(tag)}
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default TagsSelector;
