const jwt = require(
  "jsonwebtoken"
);

module.exports =
  (req, res, next) => {

    try {

      const authHeader =
        req.headers.authorization;

      /* CHECK HEADER */

      if (
        !authHeader ||
        !authHeader.startsWith(
          "Bearer "
        )
      ) {

        return res.status(401).json({

          message:
            "Authorization token missing",

        });

      }

      /* EXTRACT TOKEN */

      const token =
        authHeader.split(
          " "
        )[1];

      if (!token) {

        return res.status(401).json({

          message:
            "Invalid token format",

        });

      }

      /* VERIFY TOKEN */

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      /* ROLE CHECK */

      if (
        decoded.role !==
        "organization"
      ) {

        return res.status(403).json({

          message:
            "Access denied",

        });

      }

      /* USER CHECK */

      if (!decoded.id) {

        return res.status(401).json({

          message:
            "Invalid token payload",

        });

      }

      req.user = decoded;

      next();

    } catch (error) {

      console.error(
        "AUTH ERROR:",
        error.message
      );

      /* TOKEN EXPIRED */

      if (
        error.name ===
        "TokenExpiredError"
      ) {

        return res.status(401).json({

          message:
            "Session expired. Please login again.",

        });

      }

      /* INVALID TOKEN */

      return res.status(401).json({

        message:
          "Invalid token",

      });

    }
  };