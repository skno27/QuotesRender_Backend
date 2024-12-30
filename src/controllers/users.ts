import express, {
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import prisma from "../prisma.js";
// dont think we need this here, since passwords are handled separately // import bcrypt from "bcrypt";

// get user(s)
export const getUsers: RequestHandler = async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const getUser: RequestHandler = async (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: { quotes: true },
  });

  if (!user) {
    return next(new Error("404"));
  }
  console.log("User Found!");
  res.send({ user, quotes: user.quotes });
};

export const updateUser: RequestHandler = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) return;
  //   make sure user isnt assigning itself new roles
  delete req.body.roles;
  console.log("from updateUser", req.user);

  const user = await prisma.user.update({
    where: { id: userId },
    data: req.body,
  });

  if (!user) {
    return next(new Error("404"));
  }
  console.log("User updated successfully");
  res.json(user);
};

export const deleteUser: RequestHandler = async (req, res) => {
  const userId = req.user.id;
  if (!userId) return;
  const result = await prisma.user.delete({
    where: { id: userId },
  });

  console.log(`User ${result.username} deleted`);
  res.sendStatus(200); // confirmation status
};

export const adminDeleteUser: RequestHandler = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (!userId) return;
  const result = await prisma.user.delete({
    where: { id: userId },
  });

  console.log(`ADMIN: User ${result.username} deleted`);
  res.sendStatus(200); // confirmation status
};

export const getUserQuotes: RequestHandler = async (req, res, next) => {
  try {
    const id = Number.parseInt(req.params.id);

    if (isNaN(id)) {
      // Validate the user ID
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await prisma.user.findUnique({
      where: { id: id },
      include: {
        quotes: {
          include: {
            author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("User Found!");
    res.status(200).send({ quotes: user.quotes });
  } catch (err) {
    console.error("Error fetching user quotes:", err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user quotes" });
  }
};

export const getUserLikedQuotes: RequestHandler = async (req, res, next) => {
  const id = Number.parseInt(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      quotesLiked: true,
    },
  });
  if (!user) {
    return next(new Error("404"));
  }
  console.log("User Found!");
  res.send({ quotes: user.quotesLiked });
};
