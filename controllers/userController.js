import HttpError from "http-errors";
import userModel from '../models/usersModel.js'
import userpojo from '../models/user/userPojo.js'
import bcrypt from 'bcrypt';
import messagesapp from "../data/messages.js";
import messagesusr from '../models/user/messagesusr.js';



const register = (req, res, next) => {
    console.log(`---> userController::register`);

    try {
        const body = req.body;
        let result;
        console.log(`---> userController::register ${body.password}`);
        const user = { username: body.username, password: body.password, timestamp: (body.timestamp || 0), active: (body.avtive || 1) };

        result = userModel.getUser(user);
        if (result != undefined) {
            next(HttpError(400, { message: messagesapp.user_exist_register }));
        } else {
            result = userModel.createUser(user);
            if (result < 0) {

                next(HttpError(400, { message: messagesapp.user_error_register }))
            } else {

                const _result = userpojo(result);
                _result.message = messagesusr.user_msg_create;
                res.status(201).json(_result);

            }

        }

    } catch (error) {
        next(error);
    }

};

const login = (req, res, next) => {
    console.log(`---> userController::login`);

    try {
        const body = req.body;
        const user = { username: body.username, password: body.password };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            console.log(`---> userController::login ${result.password}`);
            console.log(`---> userController::login ${body.password}`);

            if (!result.active) {
                next(HttpError(400, { message: messagesapp.user_error_active }));
            } else {

                if (!bcrypt.compareSync(body.password, result.password))
                    next(HttpError(400, { message: messagesapp.user_error_login }));

                else {

                    const _result = userpojo(result);
                    _result.message = messagesusr.user_msg_login;

                    const notice = userModel.getUserNotices(user);
                    if (notice !== undefined) {
                        _result.notices = notice.notices;
                    }
                    res.status(200).json(_result);
                }
            }
        }

    } catch (error) {
        next(error);
    }
};

const updatePassword = (req, res, next) => {
    console.log(`---> userController::updatePassword`);

    try {
        const body = req.body;
        const user = { username: body.username, password: body.password, newpassword: body.newpassword };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            if (!bcrypt.compareSync(body.password, result.password))
                next(HttpError(400, { message: messagesapp.user_error_login }));
            else {

                const result_new = userpojo(userModel.updatePassword(user));
                result_new.message = messagesusr.user_msg_newpassw;
                res.status(200).json(result_new);
            }

        }

    } catch (error) {
        next(error);
    }
};

const addProfileData = (req, res, next) => {
    console.log(`---> userController::addProfileData`);

    try {
        const body = req.body;
        const user = { username: body.username, profiledata: body.profiledata };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userpojo(userModel.addProfileData(user));
            result_new.message = messagesusr.user_msg_addprofiledata;
            res.status(200).json(result_new);
        }
    } catch (error) {
        next(error);
    }
};



const addGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::addGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        console.log(result);


        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userpojo(userModel.addGrantPrivileges(user));
            result_new.message = messagesusr.user_msg_addgrants;
            res.status(200).json(result_new);
        }
    } catch (error) {
        next(error);
    }
};


const insertGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::insertGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userpojo(userModel.insertGrantPrivileges(user));
            result_new.message = messagesusr.user_msg_insertgrants;
            res.status(200).json(result_new);
        }
    } catch (error) {
        next(error);
    }
};



const deleteGrantPrivileges = (req, res, next) => {
    console.log(`---> userController::deleteGrantPrivileges`);

    try {
        const body = req.body;
        const user = { username: body.username, grants: body.grants };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userpojo(userModel.deleteGrantPrivileges(user));
            result_new.message = messagesusr.user_msg_deletegrants;
            res.status(200).json(result_new);
        }
    } catch (error) {
        next(error);
    }
};

const getUser = (req, res, next) => {
    console.log(`---> userController::getUser`);

    try {
        console.log(req.params.user)
        const user = req.params.user;
        const result = userModel.getUser({ username: user });

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {

            const _result = userpojo(result);
            _result.message = messagesusr.user_msg_getusr;
            res.status(200).json(_result);

        }
    } catch (error) {
        next(error);
    }
};

const getFullUser = (req, res, next) => {
    console.log(`---> userController::getFullUser`);

    try {
        const body = req.body;
        const user = { username: body.username }
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {

            res.status(200).json(result);

        }
    } catch (error) {
        next(error);
    }
};



const deleteUser = (req, res, next) => {
    console.log(`---> userController::dropUser`);

    try {
        const body = req.body;
        const user = { username: body.username };
        const result = userModel.getUser(user);


        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userpojo(userModel.dropUser(user));
            result_new.message = messagesusr.user_msg_deactivateuser;
            res.status(200).json(result_new);
        }
    } catch (error) {
        next(error);
    }
};


const activeUser = (req, res, next) => {
    console.log(`---> userController::activeUser`);

    try {
        const body = req.body;
        const user = { username: body.username };
        const result = userModel.getUser(user);

        if (result === undefined) {
            next(HttpError(400, { message: messagesapp.user_error_username }));
        } else {
            const result_new = userpojo(userModel.raiseUser(user));
            result_new.message = messagesusr.user_msg_activateuser;
            res.status(200).json(result_new);
        }
    } catch (error) {
        next(error);
    }
};


export default {
    register,
    login,
    updatePassword,
    addGrantPrivileges,
    deleteGrantPrivileges,
    insertGrantPrivileges,
    getUser,
    deleteUser,
    activeUser,
    getFullUser,
    addProfileData

}