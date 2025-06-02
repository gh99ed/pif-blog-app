
const User = require('../models/userModel'); 


const generateRandomSuffix = () => {
  return Math.random().toString(36).slice(2, 6);
};


const generateUniqueSuggestions = async (baseUsername) => {
  const suggestions = [];

  while (suggestions.length < 3) {
    const suggestion = `${baseUsername}${generateRandomSuffix()}`;
    const exists = await User.findOne({ username: suggestion });

    if (!exists) {
      suggestions.push(suggestion);
    }
  }

  return suggestions;
};

module.exports = { generateUniqueSuggestions };
