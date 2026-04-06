const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

router.get("/users", async (req, res) => {
  try {
    const db = getDB();
    const { fields } = req.query;

    let projection = {};
    if (fields) {
      const fieldArray = fields.split(",");
      fieldArray.forEach((field) => {
        projection[field.trim()] = 1;
      });
    }

    const users = await db
      .collection("users")
      .find({}, { projection })
      .toArray();

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/users/:id", async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "ID користувача невалідний",
      });
    }

    const user = await db.collection("users").findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Користувач не знайдений",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/users", async (req, res) => {
  try {
    const db = getDB();
    const { name, email, age, city } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Ім'я та email обов'язкові",
      });
    }

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Користувач з таким email вже існує",
      });
    }

    const newUser = {
      name,
      email,
      age: age ? parseInt(age) : null,
      city: city || null,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      success: true,
      message: "Користувач успішно створений",
      data: {
        _id: result.insertedId,
        ...newUser,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.post("/users/bulk", async (req, res) => {
  try {
    const db = getDB();
    const users = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Масив користувачів обов'язковий та не може бути порожнім",
      });
    }

    for (let i = 0; i < users.length; i++) {
      const { name, email } = users[i];
      if (!name || !email) {
        return res.status(400).json({
          success: false,
          error: `Користувач ${i + 1}: Ім'я та email обов'язкові`,
        });
      }
      const duplicateInBatch = users.find(
        (u, index) => u.email === email && index !== i,
      );
      if (duplicateInBatch) {
        return res.status(400).json({
          success: false,
          error: `Дублікат email в запиті: ${email}`,
        });
      }
      const existingUser = await db.collection("users").findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: `Користувач з email ${email} вже існує`,
        });
      }
    }

    const usersToInsert = users.map((user) => ({
      name: user.name,
      email: user.email,
      age: user.age ? parseInt(user.age) : null,
      city: user.city || null,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await db.collection("users").insertMany(usersToInsert);

    res.status(201).json({
      success: true,
      message: `${result.insertedCount} користувачів успішно створено`,
      data: {
        insertedIds: result.insertedIds,
        insertedCount: result.insertedCount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "ID користувача невалідний",
      });
    }

    const { name, email, age, city, active } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (age !== undefined) updateData.age = age ? parseInt(age) : null;
    if (city !== undefined) updateData.city = city || null;
    if (active !== undefined) updateData.active = active;
    updateData.updatedAt = new Date();

    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(req.params.id) },
        { $set: updateData },
        { returnDocument: "after" },
      );

    if (!result.value) {
      return res.status(404).json({
        success: false,
        error: "Користувач не знайдений",
      });
    }

    res.json({
      success: true,
      message: "Користувач успішно оновлений",
      data: result.value,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/users", async (req, res) => {
  try {
    const db = getDB();
    const { filter, update } = req.body;

    if (!filter || !update) {
      return res.status(400).json({
        success: false,
        error: "Фільтр та дані для оновлення обов'язкові",
      });
    }

    const updateData = { $set: { ...update, updatedAt: new Date() } };

    const result = await db.collection("users").updateMany(filter, updateData);

    res.json({
      success: true,
      message: `${result.modifiedCount} користувачів успішно оновлено`,
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.put("/users/:id/replace", async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "ID користувача невалідний",
      });
    }

    const { name, email, age, city, active } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Ім'я та email обов'язкові для заміни",
      });
    }

    const replacement = {
      name,
      email,
      age: age ? parseInt(age) : null,
      city: city || null,
      active: active !== undefined ? active : true,
      createdAt: new Date(), // Reset createdAt on replace
      updatedAt: new Date(),
    };

    const result = await db
      .collection("users")
      .replaceOne({ _id: new ObjectId(req.params.id) }, replacement);

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Користувач не знайдений",
      });
    }

    res.json({
      success: true,
      message: "Користувач успішно замінений",
      data: {
        _id: req.params.id,
        ...replacement,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    const db = getDB();

    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "ID користувача невалідний",
      });
    }

    const result = await db
      .collection("users")
      .findOneAndDelete({ _id: new ObjectId(req.params.id) });

    if (!result.value) {
      return res.status(404).json({
        success: false,
        error: "Користувач не знайдений",
      });
    }

    res.json({
      success: true,
      message: "Користувач успішно видалений",
      data: result.value,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.delete("/users", async (req, res) => {
  try {
    const db = getDB();
    const { filter } = req.body;

    if (!filter) {
      return res.status(400).json({
        success: false,
        error: "Фільтр для видалення обов'язковий",
      });
    }

    const result = await db.collection("users").deleteMany(filter);

    res.json({
      success: true,
      message: `${result.deletedCount} користувачів успішно видалено`,
      data: {
        deletedCount: result.deletedCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/docs", (req, res) => {
  res.json({
    message: "API Документація",
    endpoints: {
      "GET /api/users":
        "Отримати всіх користувачів (з підтримкою проекції через ?fields=name,email)",
      "GET /api/users/:id": "Отримати користувача за ID",
      "POST /api/users": "Додати нового користувача (insertOne)",
      "POST /api/users/bulk": "Додати декількох користувачів (insertMany)",
      "PUT /api/users/:id": "Оновити користувача (updateOne)",
      "PUT /api/users": "Оновити декількох користувачів (updateMany)",
      "PUT /api/users/:id/replace": "Замінити користувача (replaceOne)",
      "DELETE /api/users/:id": "Видалити користувача (deleteOne)",
      "DELETE /api/users": "Видалити декількох користувачів (deleteMany)",
    },
  });
});

module.exports = router;
