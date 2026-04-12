import { User } from "../models/user.model.js";
import { Meeting } from "../models/meeting.model.js";
import httpStatus from "http-status";
import bcrypt from "bcrypt";
import crypto from "node:crypto";

const login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Please provide both username and password" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = crypto.randomBytes(20).toString("hex");
            user.token = token;
            await user.save();

            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ msg: "Invalid credentials" });
        }

    } catch (e) {
        console.error("Login error:", e.message);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const register = async (req, res) => {
    const { name, username, password } = req.body;

    if (!username || !password || !name) {
        return res.status(400).json({ msg: "Please provide name, username, and password" });
    }

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ msg: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(httpStatus.CREATED).json({ msg: "User registered successfully" });
    } catch (e) {
        console.error("Registration error:", e.message);
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

const getUserHistory = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Token is required" });
    }

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
        }

        const meetings = await Meeting.find({ user_id: user.username })
            .sort({ date: -1 }); // Most recent first

        res.json(meetings);
    } catch (e) {
        console.error("Get history error:", e.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    if (!token || !meeting_code) {
        return res.status(400).json({ message: "Token and meeting code are required" });
    }

    try {
        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid or expired token" });
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        });

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" });
    } catch (e) {
        console.error("Add to history error:", e.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}

export { login, register, getUserHistory, addToHistory }