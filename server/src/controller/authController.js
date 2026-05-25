
import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import ProcessEmail from "../helpers/ProcessEmail.js";
import { OTP_EXPIRES_IN_MINUTES } from "../hiddenEnv.js";

const generateOtp = () => crypto.randomInt(100000, 1000000).toString();
const normalizeEmail = (email) =>
    typeof email === "string" ? email.trim().toLowerCase() : "";

const normalizeOtp = (otp) =>
    typeof otp === "string" || typeof otp === "number" ? String(otp).trim() : "";

const buildOtpEmailHtml = (otp) => `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.5;">
        <h2 style="margin: 0 0 12px;">Welcome to Blueprint</h2>
        <p>Use this one-time password to complete your account registration.</p>
        <p>Use the OTP below to continue:</p>
        <p style="font-size: 28px; font-weight: 700; letter-spacing: 6px; margin: 20px 0;">${otp}</p>
        <p>This OTP will expire in ${OTP_EXPIRES_IN_MINUTES} minutes.</p>
        <p>If you did not create this account, you can ignore this email.</p>
    </div>
`;



const RequestUserRegistration = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = normalizeEmail(email);

        if (!normalizedEmail || !password) {
            return res.status(400).send({
                message: "Email and password are required",
            });
        }

        const isUserExist = await User.findOne({ email: normalizedEmail });

        if (isUserExist && isUserExist.isVerified) {
            // only verified user will be registered 
            return res.status(409).send({
                message: "User already registered",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES  * 60 * 1000);


        await User.findOneAndUpdate(
            { email: normalizedEmail },
            {
                email: normalizedEmail,
                password: hashedPassword,
                otp: hashedOtp,
                otpExpiresAt: expiresAt,
                isVerified: false,  
            },
            { returnDocument : 'after',  upsert: true,}
        );

        await ProcessEmail({
            email: normalizedEmail,
            subject: "Your Blueprint registration OTP",
            html: buildOtpEmailHtml(otp),
        });

        return res.status(200).send({
            message: "OTP sent to email. Submit the OTP to complete registration.",
        });
    } catch (error) {
        next(error);
    }
};


const ActivateUser = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        const normalizedEmail = normalizeEmail(email);
        const normalizedOtp = normalizeOtp(otp);

        if (!normalizedEmail || !normalizedOtp) {
            return res.status(400).send({
                message: "Email and OTP are required",
            });
        }

        const user = await User.findOne({ email: normalizedEmail }).select("+otp +otpExpiresAt");

        if (!user) {
            return res.status(400).send({
                message: "User not found. Please register first.",
            });
        }

        if (user.isVerified) {
            return res.status(409).send({
                message: "User already registered",
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).send({
                message: "OTP expired",
            });
        }

        const isOtpValid = await bcrypt.compare(normalizedOtp, user.otp);

        if (!isOtpValid) {
            return res.status(400).send({
                message: "Invalid OTP",
            });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        return res.status(201).send({
            message: "User registered successfully.",
            user: user.toJSON(),  // password will be hide
        });
    } catch (error) {
        next(error);
    }
};


export { ActivateUser, RequestUserRegistration };









// const RequestUserRegistration = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         const normalizedEmail = normalizeEmail(email);

//         if (!normalizedEmail || typeof password !== "string" || !password) {
//             return res.status(400).send({
//                 message: "Email and password are required",
//             });
//         }

//         const isUserExist = await User.findOne({ email: normalizedEmail });

//         if (isUserExist) {
//             return res.status(409).send({
//                 message: "User already registered",
//             });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const otp = generateOtp();
//         const hashedOtp = await bcrypt.hash(otp, 10);
//         const expiresAt = new Date(Date.now() + OTP_EXPIRES_IN_MINUTES * 60 * 1000);

//         await PendingUser.findOneAndUpdate(
//             { email: normalizedEmail },
//             {
//                 email: normalizedEmail,
//                 password: hashedPassword,
//                 otp: hashedOtp,
//                 expiresAt,
//             },
//             {
//                 new: true,
//                 setDefaultsOnInsert: true,
//                 upsert: true,
//             }
//         );

//         await ProcessEmail({
//             email: normalizedEmail,
//             subject: "Your Blueprint registration OTP",
//             html: buildOtpEmailHtml(otp),
//         });

//         return res.status(200).send({
//             message: "OTP sent to email. Submit the OTP to complete registration.",
//         });
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).send({
//                 message: "User already registered",
//             });
//         }

//         next(error);
//     }
// };

// const ActivateUser = async (req, res, next) => {
//     try {
//         const { email, otp } = req.body;
//         const normalizedEmail = normalizeEmail(email);
//         const normalizedOtp = normalizeOtp(otp);

//         if (!normalizedEmail || !normalizedOtp) {
//             return res.status(400).send({
//                 message: "Email and OTP are required",
//             });
//         }

//         if (!/^\d{6}$/.test(normalizedOtp)) {
//             return res.status(400).send({
//                 message: "OTP must be 6 digits",
//             });
//         }

//         const pendingUser = await PendingUser.findOne({
//             email: normalizedEmail,
//         }).select("+password +otp");

//         if (!pendingUser || pendingUser.expiresAt < new Date()) {
//             await PendingUser.deleteOne({ email: normalizedEmail });

//             return res.status(400).send({
//                 message: "OTP expired or registration request not found",
//             });
//         }

//         const isOtpValid = await bcrypt.compare(normalizedOtp, pendingUser.otp);

//         if (!isOtpValid) {
//             return res.status(400).send({
//                 message: "Invalid OTP",
//             });
//         }

//         const isUserExist = await User.findOne({ email: normalizedEmail });

//         if (isUserExist) {
//             await PendingUser.deleteOne({ email: normalizedEmail });

//             return res.status(409).send({
//                 message: "User already registered",
//             });
//         }

//         const user = await User.create({
//             email: normalizedEmail,
//             password: pendingUser.password,
//         });

//         await PendingUser.deleteOne({ email: normalizedEmail });

//         return res.status(201).send({
//             message: "User registered successfully.",
//             user,
//         });
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).send({
//                 message: "User already registered",
//             });
//         }

//         next(error);
//     }
// };
