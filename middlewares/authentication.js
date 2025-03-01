// const { validateToken } = require("../services/authentication");
// function checkForAuthenticationCookie(cookieName) {
//     return (req, res, next) => {
//         const tokenCookieValue = req.cookies[cookieName];
//         if (!tokenCookieValue) {
//             return next();
            
//         }

//         try {
//             const userPayload = validateToken(tokenCookieValue);
//             req.user = userPayload;
//         } catch (error) {
//             // Handle error if needed
//         }
//         return next();
//     };
// }

// module.exports = {
//     checkForAuthenticationCookie,
// };

const { validateToken } = require("../services/authentication");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    // console.log("🔹 Headers Received:", req.headers); // ✅ Headers check karne ke liye
    // console.log("🔹 Cookies Received:", req.cookies); // ✅ Debugging

    const tokenCookieValue = req.cookies ? req.cookies[cookieName] : undefined;
    // console.log("🔹 Checking Cookie:", tokenCookieValue); 

    if (!tokenCookieValue) {
      // console.log("❌  Anand No token found in cookies!");
      return next();
    }

    try {
      const userPayload = validateToken(tokenCookieValue);
      // console.log("✅ User authenticated:", userPayload);
      req.user = userPayload;
    } catch (error) {
      // console.error("❌ Invalid Token:", error.message);
      req.user = null;
    }

    return next();
  };
}



module.exports = {
  checkForAuthenticationCookie,
};
