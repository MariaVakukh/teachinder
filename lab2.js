
import { randomUserMock, additionalUsers } from "./FE4U-Lab2-mock.js";
/* import { users} from "./lab4.js"; */


export function task1(arr1) {
  const courses = ["Mathematics", "Physics", "English", "Computer Science", "Dancing", "Chess", "Biology", "Chemistry",
    "Law", "Art", "Medicine", "Statistics"];
  let formattedUsers = arr1.map(
    (obj) => {
      return {
        gender: obj.gender,
        title: obj.name.title,
        full_name: `${obj.name.first} ${obj.name.last}`,
        city: obj.location.city,
        state: obj.location.state,
        country: obj.location.country,
        postcode: obj.location.postcode,
        coordinates: obj.location.coordinates,
        timezone: obj.location.timezone,
        email: obj.email,
        b_date: obj.dob.date,
        age: obj.dob.age,
        phone: obj.phone,
        picture_large: obj.picture.large,
        picture_thumbnail: obj.picture.thumbnail,

        /* new propeties*/
        id: obj.id.value,
        course: undefined,
        bg_color: undefined,
        note: null
      }
    }
  );

/*   let allFormattedUsers = [...formattedUsers, ...additionalUsers]; */
  let allFormattedUsers = [...formattedUsers];


  function generateId() {
    return `${Math.floor(10_000_000_000 + Math.random() * 9_000_000_00000)}`;
  }

  function validateId(id) {
    return (!id || id.includes("NaN") || id.includes("undefined")) ? generateId() : id;
  }

  const uniqueUsers = [];

  allFormattedUsers.forEach(user => {
    const exist = uniqueUsers.find(
      u => u.full_name === user.full_name
    );
    if (exist) {
      for (let key in user) {
        if (!exist[key]) {
          exist[key] = user[key];
        }
      }
    } else {
      uniqueUsers.push(user);
    }

  });

  uniqueUsers.forEach(user => {
    user.id = validateId(user.id);
    user.course ??= courses[Math.floor(Math.random() * courses.length)];
    user.bg_color ??= "#fff";
  })

  return uniqueUsers;

}



export function task2(objects) {
  const valid = [];
  const invalid = [];

  function firstLetterCheck(word) {
    const firstChar = word.charAt(0);

    //if first character can have upper case, then it must be in upper case 
    if (firstChar.toLocaleUpperCase() !== firstChar.toLocaleLowerCase()) {
      return /^\p{Lu}/u.test(firstChar);
    }
    return /^\p{L}/u.test(firstChar);
  }

  function checkFullName(fullName) {
    if (typeof fullName !== "string" || !fullName.trim()) return false;
    const words = fullName.trim().split(/\s+/);

    if (words.length < 2) return false;
    if (!firstLetterCheck(words[0])) return false;
    if (!firstLetterCheck(words[1])) return false;

    return true;
  }


  for (const obj of objects) {
    let isValid = true;
    const reasons = [];

    if (typeof obj.gender === "string") {
      obj.gender = obj.gender.charAt(0).toUpperCase() + obj.gender.slice(1).toLowerCase();
    }

    if (obj.note !== null && typeof obj.note !== "string") {
      isValid = false;
      reasons.push("Field \"note\" must be a string");
    }

    const userFields = ["gender", "city", "country"];
    for (const field of userFields) {
      if (typeof obj[field] !== "string" || obj[field] == null || !firstLetterCheck(obj[field])) {
        isValid = false;
        reasons.push(`Field "${field}" is incorrect`);
      }
    }

    if (!checkFullName(obj.full_name)) {
      isValid = false;
      reasons.push("Field \"name\" is incorrect");
    }

    if (typeof obj.age !== "number") {
      isValid = false;
      reasons.push("Field \"age\" is incorrect");
    }

    if (obj.phone) {
      const cleanedPhone = obj.phone.replace(/\D/g, ""); 
      if (!/^\d{7,15}$/.test(cleanedPhone)) {
        isValid = false;
        reasons.push("Field 'phone' must contain 7 to 15 characters");
      }
    } else {
      isValid = false;
      reasons.push("Phone is missing");
    }

    if (typeof obj.email !== "string" || !/^[^@]+@[^@]+\.[^@]+$/.test(obj.email)) {
      isValid = false;
      reasons.push("Email is incorrect");
    }

    if (isValid) {
      valid.push(obj);
    } else {
      invalid.push({ obj, reasons });
    }
  }

  return { valid, invalid };
}

const formatUserList = task1(randomUserMock, additionalUsers);
const validatedUsers = task2(formatUserList);

/*console.log("Valid:", validatedUsers.valid);
console.log("Invalid:", validatedUsers.invalid);
 */


export function task3(arr, filters) {
  return arr.filter(obj => {
    for (const key in filters) {
      const filterVal = filters[key];

      if (filterVal === "All") continue;

      if (key === "age" && Array.isArray(filterVal)) {
        const [min, max] = filterVal;
        if (obj.age < min || obj.age > max) return false;
      }

      else if (obj[key] !== filterVal) {
        return false;

      
      }
    }
    return true;
  });
}

const filters = {
  country: "All",
  gender: "Female",
  age: [20, 40]
}

const filterUsers = task3(validatedUsers.valid, filters);

/* console.log(filterUsers); */



export function task4(arr, field, order) {
  const sorted = [...arr];
  sorted.sort((a, b) => {
    let A = a[field];
    let B = b[field];

    if (typeof A === "string" && typeof B === "string") {
      A = A.toLowerCase();
      B = B.toLowerCase();
      if (A < B) return order === "abc" ? -1 : 1;
      if (A > B) return order === "abc" ? 1 : -1;
      return 0;
    }

    if (field === "b_date" || field === "b_day") {
      A = new Date(A);
      B = new Date(B);
    }

    if (A < B) return order === "abc" ? -1 : 1;
    if (A > B) return order === "abc" ? 1 : -1;
    return 0;
  });

  return sorted;
}

const sortUsers = task4(validatedUsers.valid, "b_date", "abc");



export function task5(arr, value) {
    const searchValue = value.toLowerCase();
    return arr.filter(obj => {
        const nameMatch = obj.full_name.toLowerCase().includes(searchValue);
        const noteMatch = obj.note?.toLowerCase().includes(searchValue); //optional changing for note, note can be null
        const ageMatch = obj.age.toString() === searchValue; 
        return nameMatch || noteMatch || ageMatch;
    });
}

const searchUsers = task5(validatedUsers.valid, "60");


function  task6(objects, f) {
  if (!objects.length) return 0;

  const matching = objects.filter(f).length;
  const percentage = (matching / objects.length) * 100;

  return Math.round(percentage); 
}

const findPercentage = task6(validatedUsers.valid, p => p.gender == "Female");

/* const jsonString = JSON.stringify(users, null, 2);
fs.writeFileSync("users.json", jsonString, "utf-8");
console.log(users.length) */
