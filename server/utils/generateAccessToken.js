import jwt from 'jsonwebtoken';

const generateAccessToken = (res, user) => {
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "email": user.email,
                "roles": user.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: '15m' }
    );

    res.send({ 
        accessToken,
        userInfo: { 
            id: user._id,
        } 
    });
}

export default generateAccessToken;
