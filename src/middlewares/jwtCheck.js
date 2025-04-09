import * as jwt from 'jsonwebtoken';
import { app } from '../config';
import {findById} from '../db/queries/user.query';
import {tokenConstans} from '../constans/UtilConstans'

export const verifyToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) return res.status(401).json({ message: tokenConstans.NO_TOKEN })
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, app.secret)
        const user = await findById(decoded.id)
        if (user[0].length==0) return res.status(404).json({ message: tokenConstans.NO_USER })
        req.user = user;
        next()
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}