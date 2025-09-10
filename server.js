const app = require("./index");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
