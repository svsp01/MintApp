import dbConnect from "@/DataBase/dbConnect";
import UserModal from "@/models/UserModal";
import { NextRequest, NextResponse } from "next/server";
import bcrypt, { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export async function GET() {
  try {
    await dbConnect();
    const data = await UserModal.find({});
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    if (body.username) {
      const {
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        profileImageUrl,
        monthlyIncome,
        bio,
      } = body;
      const existingUser = await UserModal.findOne({ email });

      if (existingUser) {
        return NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        username,
        email,
        firstName,
        lastName,
        password: hashedPassword,
        phoneNumber,
        monthlyIncome,
        profileImageUrl,
        bio,
        createdAt: new Date(),
        lastLogin: new Date(),
      };
      const result = await UserModal.create(newUser);

      return NextResponse.json(
        { message: "User created successfully", userId: result.insertedId },
        { status: 201 }
      );
    } else {
      const { email, password } = body;
      const user = await UserModal.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 400 }
        );
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Invalid password" },
          { status: 400 }
        );
      }

      const token = sign(
        { userId: user._id, email: user.email, username: user.name },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: "1h",
        }
      );
      const response = NextResponse.json({
        message: "Login successful",
        data: {
          userId: user._id,
          profileImageUrl: user?.profileImageUrl,
          monthlyIncome: user?.monthlyIncome,
          email: user.email,
          username: user.name,
          token: token,
        },
      });
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000, 
      });

      return response;
    }
  } catch (error) {}
}
