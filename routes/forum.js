const express = require('express');

module.exports = function(config){
    const forum = require('forum')(config);
    var router = express.Router();

    router.get('/:sectionID/post', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var opt = {
            page_num: req.query['page_num'],
            tag_filter: req.query['tag_filter'] || 0,
            sticky: req.query['sticky'] === 'true',
            find_filter: req.params['find_filter'] || 0
        }

        if(req.query['person_post'])
            opt.person_post = req.query['person_post'];

        if(req.query['search_text'])
            opt.search_text = req.query['search_text'];

        try {
            var result = await forum.getAllPost(sectionID, opt);
        } catch (error) {
            throw error;
            res.sendStatus(500);
        }

        sendData = {
            "message": "ok",
            "data": result
        };

        res.status(200).jsonp(sendData);
    });

    /**
     * @api {post} /:sectionID/post 发布新的帖子 
     * @apiName 发帖
     * @apiGroup forum
     *
     * @apiParam {Number} sectionID 发布帖子的板块ID.
     * @apiParam {String} post_title 发布帖子的标题.
     * @apiParam {String} post_author 发布帖子的作者.
     * @apiParam {Number} post_tag 发布帖子的标签.
     * @apiParam {String} post_content 发布帖子的正文内容.
     *
     * @apiSuccess {String} firstname Firstname of the User.
     * @apiSuccess {String} lastname  Lastname of the User.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "firstname": "John",
     *       "lastname": "Doe"
     *     }
     *
     * @apiError UserNotFound The id of the User was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "UserNotFound"
     *     }
     */

    router.post('/:sectionID/post', async function (req, res) {
        let dataToSend;
        var sectionID = parseInt(req.params['sectionID']);

        var post_tag = req.body.post_tag;

        if(!req.body.post_title){
            dataToSend = {
                "message": "标题不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }
        /*if(!req.headers['user-id']){
            dataToSend = {
                "message": "作者不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }*/
        if(typeof post_tag !== 'number'){
            res.status(422).jsonp({
                "message": "标签不合法"
            });
            return;
        }
        if(!req.body.post_content){
            dataToSend = {
                "message": "帖子内容不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }
        else{
            var data = {
                post_title: req.body.post_title,
                // post_author: req.headers['user-id'],
                post_author: req.body.post_author,
                post_tag: req.body.post_tag,
                post_content: req.body.post_content
            };

            var opt = {
                sticky : req.body.sticky || false
            }; 
            let result = await forum.submitPost(sectionID, data, opt);

            if (result){
                dataToSend = {
                    "message": "ok"
                };
                res.status(200).jsonp(dataToSend);
            }
            else{
                dataToSend = {
                    "message": "上传失败"
                };
                res.status(500).jsonp(dataToSend);
            }
        }
      
    });

    router.get('/:sectionID/post/:postID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];

        try {
            await forum.toggleVisitIncrease(sectionID, postID);
            var result = await forum.getPostDetail(sectionID, postID);
        } catch (error) {
            throw error;
            res.sendStatus(500);
        }

        var sendData = {
            "message": "ok",
            "data": result[0]
        };

        res.status(200).jsonp(sendData);
    });

    router.post('/:sectionID/post/:postID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];
        let dataToSend;
        if(!req.body.post_title){
            dataToSend = {
                "message": "标题不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }
        if(!req.headers['user-id']){
            dataToSend = {
                "message": "作者不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }
        if(!req.body.post_content){
            dataToSend = {
                "message": "帖子内容不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }
        else{
            var data = req.body;
            data.post_author = req.headers['user-id'];
            var opt = {
                stikcy : req.body.sticky || false
            }

            try {
                var result = await forum.updatePostDetail(sectionID, postID, data, opt);
            } catch (error) {
                throw error;
                res.sendStatus(500);
            }

            if (result) {
                dataToSend = {
                    "message": "ok"
                };
                res.status(200).jsonp(dataToSend);
            } else {
                dataToSend = {
                    "message": "更新失败"
                };
                res.status(500).jsonp(dataToSend);
            }
        }
    });

    router.get('/:sectionID/post/:postID/comment', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];

        let result = await forum.getAllComment(sectionID, postID);
        var sendData = {
            "message": "ok",
            "data": result
        };
        res.status(200).jsonp(sendData);
    });

    router.post('/:sectionID/post/:postID/comment', async function(req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];
        let dataToSend;
        if(!req.body.comment_author){
            dataToSend = {
                "message": "评论作者不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return;
        }
        if(!req.headers['user-id']){
            dataToSend = {
                "message": "评论内容不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return ;
        }
        else{
            var data = req.body;
            data.comment_author = req.headers['user-id'];
            try {
                await forum.submitComment(sectionID, postID, data);
            } catch (error) {
                throw error;
                res.sendStatus(500);
            }

            dataToSend = {
                "message": "ok"
            };
            res.status(200).jsonp(dataToSend);
        }
    });

    router.post('/:sectionID/post/:postID/comment/:commentID', async function(req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var postID = req.params['postID'];
        var commentID = req.params['commentID'];
        let dataToSend;
        if(!req.headers['user-id']){
            dataToSend = {
                "message": "评论作者不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return ;
        }
        if(!req.body.comment_content){
            dataToSend = {
                "message": "评论内容不能为空"
            };
            res.status(422).jsonp(dataToSend);
            return ;
        }
        else{
            var data = req.body.data;
            data.comment_author = req.headers['user-id'];
            let result = await forum.updateComment(sectionID, postID, commentID, data);

            if (result) {
                var successMsg = {
                    "message": "ok"
                };
                res.status(200).jsonp(successMsg);
            } else {
                var errMsg = {
                    "message": "更新失败"
                };
                res.status(500).jsonp(errMsg);
            }
        }
    });

    return router;
}
