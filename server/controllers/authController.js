import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from "../models/userModel.js";
import generateAccessToken from '../utils/generateAccessToken.js';

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();

    const match =  await user.comparePassword(password, async function(err, isMatch) {
        if (err) throw err;
        return isMatch
    });

    if (match) {
        const refreshToken = jwt.sign(
            { "email": user.email },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: '7d' }
        )
    
        res.cookie('jwt', refreshToken, {
            httpOnly: true, 
            secure: true,
            sameSite: 'None',
            partitioned: process.env.NODE_ENV !== 'development',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });
        generateAccessToken(res, user);
    } else {
        res.status(401).send('Unauthorized');
    }
}

export const refresh = async (req, res) => {
    const cookies = req.cookies;

    try {
        const refreshToken = cookies.jwt;

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY,
            async (error, decoded) => {
                if (error) return res.status(403).json({ message: 'Forbidden' });

                const user = await User.findOne({ email: decoded.email }).exec();

                if (!user) return res.status(401).json({ message: 'Unauthorized' });
                
                generateAccessToken(res, user);
            }
        )
    } catch (error) {
        res.status(401).send({ message: 'Unauthorized' });
    }
}

export const logout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(204);

    res.clearCookie('jwt', { 
        httpOnly: true, 
        sameSite: 'None', 
        partitioned: process.env.NODE_ENV !== 'development', 
        secure: true, 
    });
    res.send({ message: 'Cookie destroyed' });
}