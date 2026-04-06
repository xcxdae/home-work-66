const BASE_URL = "http://localhost:4000/api";

async function getAllUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const data = await response.json();
    console.log("✓ Всі користувачі:", data);
    return data;
  } catch (error) {
    console.error("✗ Помилка при отриманні користувачів:", error);
  }
}

async function getUserById(id) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`);
    const data = await response.json();
    console.log("✓ Користувач:", data);
    return data;
  } catch (error) {
    console.error("✗ Помилка при отриманні користувача:", error);
  }
}

async function addUser(userData) {
  try {
    const response = await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log("✓ Користувач додан:", data);
    return data;
  } catch (error) {
    console.error("✗ Помилка при додаванні користувача:", error);
  }
}

async function updateUser(id, userData) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    console.log("✓ Користувач оновлен:", data);
    return data;
  } catch (error) {
    console.error("✗ Помилка при оновленні користувача:", error);
  }
}

async function deleteUser(id) {
  try {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log("✓ Користувач видалений:", data);
    return data;
  } catch (error) {
    console.error("✗ Помилка при видаленні користувача:", error);
  }
}

async function getApiDocs() {
  try {
    const response = await fetch(`${BASE_URL}/docs`);
    const data = await response.json();
    console.log("📚 API Документація:", data);
    return data;
  } catch (error) {
    console.error("✗ Помилка при отриманні документації:", error);
  }
}

async function runDemo() {
  console.log("🚀 Запуск демо API...\n");

  console.log("📚 Крок 1: Отримання документації");
  await getApiDocs();
  console.log("");

  console.log("👥 Крок 2: Отримання всіх користувачів");
  await getAllUsers();
  console.log("");

  console.log("➕ Крок 3: Додавання нового користувача");
  const newUser = {
    name: "Анна Коваленко",
    email: "anna@example.com",
    age: 28,
    city: "Львів",
  };
  const addedUser = await addUser(newUser);
  console.log("");

  if (addedUser.data?._id) {
    console.log("✏️  Крок 4: Оновлення користувача");
    await updateUser(addedUser.data._id, {
      age: 29,
      city: "Харків",
    });
    console.log("");

    console.log("🔍 Крок 5: Отримання оновленого користувача");
    await getUserById(addedUser.data._id);
    console.log("");

    console.log("🗑️  Крок 6: Видалення користувача");
    await deleteUser(addedUser.data._id);
    console.log("");
  }

  console.log("✅ Демо завершено!");
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  getApiDocs,
  runDemo,
};
