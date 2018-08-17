const express = require('express');

module.exports = function(config){
    const forum = require('forum')(config);
    var router = express.Router();

    router.get('/:sectionID/post', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        
        var opt = {
            page_num: req.query['page_num'],
            tag_filter: req.query['tag_filter'] || 0
        }
        try {
            var result = await forum.getAllPost(sectionID, opt);
        } catch (error) {
            throw error;
        }

        sendData = {
            "status": 1,
            "message": "SUCCESS",
            "data": result
        };

        res.jsonp(sendData);
    });

    /*
     * title author tag content
     */

    router.post('/:sectionID/post', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);

        var data = {
            post_title: req.body.post_title,
            post_author: req.body.post_author,
            post_tag: req.body.post_tag,
            post_content: req.body.post_content
        };

        var dataToSend;

        let result = await forum.submitPost(sectionID, data);

        if (result)
            dataToSend = {
                "code": 1,
                "message": "SUCCESS"
            };
        else
            dataToSend = {
                "code": 2,
                "message": "UNKNOWN_ERR"
            };

        res.jsonp(dataToSend);
    });

    router.get('/:sectionID/post/:postID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];

        try {
            await forum.toggleVisitIncrease(sectionID, postID);
            var result = await forum.getPostDetail(sectionID, postID);
        } catch (error) {
            throw error;
        }

        var sendData = {
            "code": 1,
            "message": "SUCCESS",
            "data": result[0]
        };

        res.jsonp(sendData);
    });

    router.post('/:sectionID/post/:postID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];
        var data = req.body;

        try {
            var result = await forum.updatePostDetail(sectionID, postID, data);
        } catch (error) {
            throw error;
        }

        let dataToSend;

        if (result) {
            dataToSend = {
                "code": 1,
                "message": "SUCCESS"
            };
        } else {
            dataToSend = {
                "code": 2,
                "message": "UNKNOWN_ERR"
            };
        }

        res.jsonp(dataToSend);
    });

    router.get('/:sectionID/post/:postID/comment', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];

        let result = await forum.getAllComment(sectionID, postID);
        var sendData = {
            "code": 1,
            "message": "SUCCESS",
            "data": result
        };

        res.jsonp(sendData);
    });

    router.post('/:sectionID/post/:postID/comment', async function(req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];
        var data = req.body;

        try {
            await forum.submitComment(sectionID, postID, data);
        } catch (error) {
            throw error;
        }

        var successMsg = {
            "code": 1,
            "message": "SUCCESS"
        };
        res.jsonp(successMsg);
    });

    router.post('/:sectionID/post/:postID/comment/:commentID', async function(req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];
        var commentID = req.params['commentID'];
        var data = req.body.data;

        let result = await forum.updateComment(sectionID, postID, commentID, data);

        if (result) {
            var successMsg = {
                "code": 1,
                "message": "SUCCESS"
            };
            res.jsonp(successMsg);
        } else {
            var errMsg = {
                "code": 2,
                "message": "UNKNOWN_ERR"
            };
            res.jsonp(errMsg);
        }
    });

    return router;
}
