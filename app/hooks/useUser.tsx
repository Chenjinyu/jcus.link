// import { useEffect, useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { getCookie, setCookie } from "@/app/utils/cookies";
// import { USER_ID_COOKIE_NAME } from "@/app//utils/constants";

// export function useUser() {
//   const [userId, setUserId] = useState<string>();

//   useEffect(() => {
//     if (userId) return;

//     const userIdCookie = getCookie(USER_ID_COOKIE_NAME);
//     if (userIdCookie) {
//       setUserId(userIdCookie);
//     } else {
//       const newUserId = uuidv4();
//       setUserId(newUserId);
//       setCookie(USER_ID_COOKIE_NAME, newUserId);
//     }
//   }, [userId]);

//   return {
//     userId,
//   };
// }
