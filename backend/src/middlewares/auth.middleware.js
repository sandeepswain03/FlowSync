import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";
import redis from "../utils/redis.js";

// Check Authorization Middleware
const checkAuth = async (req, res, next) => {
    const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken || !refreshToken) {
        return res
            .status(401)
            .json(new apiError(401, {}, "unauthorized request"));
    }

    // Check if tokens are blacklisted in Redis
    const [isAccessTokenBlacklisted, isRefreshTokenBlacklisted] =
        await Promise.all([
            redis.get(`bl_${accessToken}`),
            redis.get(`bl_${refreshToken}`)
        ]);

    if (isAccessTokenBlacklisted || isRefreshTokenBlacklisted) {
        return handleLogout(req, res);
    }

    // Verify Access Token
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return handleAccessTokenExpired(req, res, refreshToken, next);
        }
        req.user = user;
        next();
    });
};

// Handle Expired Access Token and Refresh Logic
const handleAccessTokenExpired = async (req, res, refreshToken, next) => {
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decodedUser) => {
            if (err) {
                const user = await User.findOne({ refreshToken });

                if (!user) {
                    return handleLogout(req, res);
                }

                // Clear refresh token in database
                await User.findByIdAndUpdate(
                    user._id,
                    { refreshToken: null },
                    { new: true }
                );

                // Add refresh token to Redis blacklist
                await redis.setex(`bl_${refreshToken}`, 7 * 24 * 3600, "true");

                return handleLogout(req, res);
            }

            // Generate new Access Token if Refresh Token is valid
            const user = await User.findById(decodedUser._id);
            if (!user) {
                return res
                    .status(404)
                    .json(new apiError(404, {}, "user not found"));
            }

            const accessToken = user.generateAccessToken();
            res.cookie("accessToken", accessToken);

            req.user = user;
            next();
        }
    );
};

// Handle Logout (Clear Cookies and Send Session Expired Response)
const handleLogout = async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    };

    return res
        .status(419)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(419, {}, "session expired"));
};

export default checkAuth;
