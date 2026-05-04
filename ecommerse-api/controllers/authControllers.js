const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    const hash = bcrypt.hashSync(password, 10);

    db.query(
        "INSERT INTO users (name, email, passwordHash) VALUES (?, ?, ?)",
        [name, email, hash],
        (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "User registered" });
        }
    );
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (result.length === 0) return res.json({ message: "User not found" });

        const user = result[0];
        const match = bcrypt.compareSync(password, user.passwordHash);

        if (!match) return res.json({ message: "Wrong password" });

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ token });
    });
};