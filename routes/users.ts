import {Router} from 'express';
import {createUser, getCurrentUser, updateUserProfile} from "../controllers/users";
import {celebrate} from "celebrate";
import {
    createUserValidationSchema,
    loginValidationSchema,
    updateUserValidationSchema
} from "../middlewares/schemaValidator";
import {login, logout} from "../controllers/login";
import {auth} from "../middlewares/auth";

const router = Router();

router.post('/signup', celebrate(createUserValidationSchema), createUser);
router.post('/login', celebrate(loginValidationSchema), login);
router.get('/users/me', auth, getCurrentUser);
router.post('/logout', auth, logout);
router.patch('/users/me', auth, celebrate(updateUserValidationSchema), updateUserProfile);

export default router;
