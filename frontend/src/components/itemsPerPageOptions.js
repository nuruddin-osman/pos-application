// utils/itemsPerPageOptions.js
export const getItemsPerPageOptions = () => {
  const options = [];

  // Add standard options
  for (let i = 5; i <= 20; i += 5) {
    options.push(i);
  }

  // Add more options up to 100
  for (let i = 40; i <= 100; i += 20) {
    options.push(i);
  }

  // Add large options up to 1000
  for (let i = 200; i <= 1000; i += 200) {
    options.push(i);
  }

  return options;
};
