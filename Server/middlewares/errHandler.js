const errHandler = (err, req, res, next) => {
console.log(err)  
switch (err.name) {
    case "SequelizeValidationError":
    case "SequelizeUniqueConstraintError":
      res.status(400).json({ message: err.errors[0].message });
      return;
    case "Email Empty":
      res.status(400).json({ message: "Email cannot be empty" });
      return;
    case "fullName Empty":
      res.status(400).json({ message: "Name cannot be empty" });
      return;
    case "birthOfDate Empty":
      res.status(400).json({ message: "Birth Date cannot be empty" });
      return;
    case "phoneNumber Empty":
      res.status(400).json({ message: "Phone number cannot be empty" });
      return;
    case "address Empty":
      res.status(400).json({ message: "Address cannot be empty" });
      return;
    case "Password Empty":
      res.status(400).json({ message: "Password cannot be empty" });
      return;
    case "outOfStock":
      res.status(404).json({ message: "Ticket out of stock" });
      return;
    case "Invalid Login":
      res.status(401).json({ message: "Email or Password invalid" });
      return;
    case "Invalid Token":
      res.status(401).json({ message: "Invalid token" });
      return;
    case "notFound":
      res.status(404).json({ message: "Data Not Found" });
      return;
    case "Unauthorized":
    case "JsonWebTokenError":
    case "TokenExpiredError":
      res.status(401).json({ message: "Invalid token" });
      return;
    default:
      res.status(500).json({ message: "Internal server error" });
      return;
  }
};

module.exports = errHandler;
