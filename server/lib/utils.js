import JWT from 'jsonwebtoken';

// function to generate JWT token
export const generateToken= (userId)=>{
    const token= JWT.sign({id:userId}, process.env.JWT_SECRET)
    return token
}