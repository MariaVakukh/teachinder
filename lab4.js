
export async function getUsers() {
  try {
    const response = await fetch("https://randomuser.me/api/?results=50");
    const data = await response.json(); return data.results;
  } catch (error) {
    console.error("Failed adding users:", error);

  }
}
export const users = await getUsers();