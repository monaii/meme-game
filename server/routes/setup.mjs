// server/auth/setup.mjs
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';

const initializePassport = async () => {
    const db = await open({
        filename: './database.db',
        driver: sqlite3.Database
    });

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};

initializePassport();
