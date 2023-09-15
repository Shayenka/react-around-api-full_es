const jwt require('jsonwebtoken');

export const generateAuthToken = (data) => {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: '7d'});
        return token;
}