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
      const tokenCookieValue = req.cookies[cookieName];
      console.log("🔹 Token from Cookie:", tokenCookieValue);
      
      if (!tokenCookieValue) {
          console.log("❌ No token found in cookies!");
          return next();
      }

      try {
          const userPayload = validateToken(tokenCookieValue);
          console.log("✅ User payload decoded:", userPayload);
          req.user = userPayload;
      } catch (error) {
          console.error("❌ Invalid Token:", error.message);
      }

      return next();
  };
}


module.exports = {
  checkForAuthenticationCookie,
};
