function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
const validatePassword = (password) => {
  // Ít nhất 6 ký tự, có chữ hoa, chữ thường và số
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
  return regex.test(password);
};
module.exports = {
  validateEmail,
  validatePassword,
};