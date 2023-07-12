const {_createRelative,_getAllRelatives,_updateRelative, _deleteRelative,_exportRelatives} =require('../services/relative.service')
const apiResponse = require("../../../_helpers/api-response");
const Router = require('express');
const router = Router();
const { upload } = require("../../../_helpers/aws_s3_fileupload");
const multer = require('multer');

// const uploadMiddleware = multer().single('profile_image');



router.post("/rel", uploadCommissionAttachments.array('profile_image',4), createRelatives);
router.get("/rel",getAllRelatives)
router.put('/rel/:id', updateRelative);
router.patch("/updaterel/:id",deleteRelative)
router.get("/export",exportRelatives)


module.exports=router

function createRelatives(req, res, next) {
    _createRelative(req)
        .then((data) =>
            res.json(apiResponse({
                data: data,
                status: "OK",
                message: "created Successfully!",
            })))
        .catch((err) => next(err));
}

function getAllRelatives(req, res, next) {
    _getAllRelatives(req)
        .then((types) =>
            res.json(apiResponse({
                data: types,
                status: "OK",
                message: "Data Fetched Successfully!",
            })))
        .catch((err) => next(err));
}

function updateRelative(req, res, next) {
    _updateRelative(req)
        .then((data) =>
            res.json(apiResponse({
                data: data,
                status: "OK",
                message: "Relative Updated Successfully!",
            })))
        .catch((err) => next(err));
}

function deleteRelative(req, res, next) {
    _deleteRelative(req)
        .then((data) =>
            res.json(apiResponse({
                data: data,
                status: "OK",
                message: "Deleted  Successfully!",
            })))
        .catch((err) => next(err));
}

function exportRelatives(req, res, next) {
    _exportRelatives(req)
        .then((relative) =>
            relative ?
                res.json(apiResponse({
                    data: relative,
                    status: "OK",
                    message: "Exported Successfully!",
                })) :
                res.status(400).json(
                    relative
                ))
        .catch((err) => next(err));
}





