export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // temporary logic
    res.status(201).json({
      message: "User registered successfully",
      user: { name, email }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // temporary logic
    res.status(200).json({
      message: "Login successful",
      email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
