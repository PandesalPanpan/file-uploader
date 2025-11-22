// Gen Password
export const hashPassword = async (password) => {
    const hashed = await bcrypt.hash(password, 10);
    return hashed;
}

// Validate Password
export const validatePassword = async (password, hashedPassword) => {
    const matched = await bcrypt.compare(password, hashedPassword)
    return matched;
}