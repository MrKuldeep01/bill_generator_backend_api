export const Validator = {
  // Validate email format
  isEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  // Validate mobile number (Indian 10-digit)
  isMobileNumber(mobile) {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  },

  // Check if string contains only alphabets (optionally with space)
  isAlphabetic(str) {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(str);
  },

  // Check if string contains only alphanumeric characters
  isAlphanumeric(str) {
    const regex = /^[A-Za-z0-9]+$/;
    return regex.test(str);
  },
  testEmptyCheck(arr) {
    if (arr.some((item) => item.trim().length === 0)) {
      console.log("Some fields are still empty!");
      return {code:400, message:"Please check all required fields!"};
    }
    else return null;
  },

  // Check if input is a valid number (integer or float)
  isNumeric(value) {
    return !isNaN(value);
  },

  // Validate password strength (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char)
  isStrongPassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  },

  // Validate Indian PIN code (6-digit)
  isPostalCode(pin) {
    const regex = /^\d{6}$/;
    return regex.test(pin);
  },

  // Check if a field is empty or only whitespace
  isEmpty(value) {
    return !value || value.trim().length === 0;
  },

  // Validate URL format
  isURL(url) {
    const regex =
      /^(https?:\/\/)?([\w.-]+)+(:\d+)?(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?$/;
    return regex.test(url);
  },
};
