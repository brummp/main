const express = require('express');
var router = express.Router();
var forum;

module.exports = function (config) {
    forum = require('forum')(config);

    return router;
}

router.get('/:sectionID/post', async function (req, res) {
    var sectionID = parseInt(req.params['sectionID']);
    var opt = {
        page_num: req.query['page_num'],
        tag_filter: req.query['tag_filter'] || 0,
        sticky: req.query['sticky'] === 'true',
        find_filter: req.params['find_filter'] || 0
    }

    if (req.query['person_post'])
        opt.person_post = req.query['person_post'];

    if (req.query['search_text'])
        opt.search_text = req.query['search_text'];

    try {
        var result = await forum.getAllPost(sectionID, opt);
        res.status(200).jsonp({
            "message": "ok",
            "data": result
        });
    } catch (error) {
        res.sendStatus(500).jsonp({
            "message": "获取失败",
        });
        throw err;
    }
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
    var userId = req.headers['User-Id'];
    var sectionID = parseInt(req.params['sectionID']);

    var post_tag = req.body.post_tag;

    if (!userId)
        return res.status(401).jsonp({
            "message": "未登录"
        });

    if (!req.body.post_title)
        return res.status(422).jsonp({
            "message": "标题不能为空"
        });

    if (typeof post_tag !== 'number')
        return res.status(422).jsonp({
            "message": "标签不合法"
        });

    if (!req.body.post_content)
        return res.status(422).jsonp({
            "message": "帖子内容不能为空"
        });

    var data = {
        post_title: req.body.post_title,
        post_author: userId,
        post_tag: req.body.post_tag,
        post_content: req.body.post_content
    };

    var opt = {
        sticky: req.body.sticky || false
    };

    try {
        await forum.submitPost(sectionID, data, opt);
        res.status(200).jsonp({
            "message": "ok"
        });
    } catch (err) {
        res.status(500).jsonp({
            "message": "上传失败"
        });
        throw err;
    }
});

router.get('/:sectionID/post/:postID', async function (req, res) {
    var sectionID = parseInt(req.params['sectionID']);
    var postID = req.params['postID'];

    try {
        await forum.toggleVisitIncrease(sectionID, postID);
        var result = await forum.getPostDetail(sectionID, postID);

        res.status(200).jsonp({
            "message": "ok",
            "data": result[0]
        });
    } catch (err) {
        res.sendStatus(500).jsonp({
            "message": "获取失败"
        });
        throw err;
    }


});

router.post('/:sectionID/post/:postID', async function (req, res) {
    var userId = req.headers['User-Id'];

    var sectionID = parseInt(req.params['sectionID']);
    var postID = req.params['postID'];

    if (!userId)
        return res.status(401).jsonp({
            "message": "未登录"
        });

    if (!req.body.post_title)
        return res.status(422).jsonp({
            "message": "标题不能为空"
        });

    if (!req.body.post_content)
        return res.status(422).jsonp({
            "message": "帖子内容不能为空"
        });

    var data = {
        post_title: req.body.post_title,
        post_author: userId,
        post_tag: req.body.post_tag,
        post_content: req.body.post_content
    };

    var opt = {
        stikcy: req.body.sticky || false
    }

    try {
        await forum.updatePostDetail(sectionID, postID, data, opt);
        res.status(200).jsonp({
            "message": "ok"
        });
    } catch (err) {
        res.sendStatus(500).jsonp({
            "message": "更新失败"
        });
        throw err;
    }
});

router.get('/:sectionID/post/:postID/comment', async function (req, res) {
    var sectionID = parseInt(req.params['sectionID']);
    var postID = req.params['postID'];

    let result = await forum.getAllComment(sectionID, postID);

    res.status(200).jsonp({
        "message": "ok",
        "data": result
    });
});

router.post('/:sectionID/post/:postID/comment', async function (req, res) {
    var userId = req.headers['User-Id'];

    var sectionID = parseInt(req.params['sectionID']);
    var postID = req.params['postID'];

    if (!userId)
        return res.status(401).jsonp({
            "message": "未登录"
        });

    if (!req.body.comment_content)
        return res.status(422).jsonp({
            "message": "评论内容不能为空"
        });

    var data = {
        comment_content: req.body.comment_content,
        comment_author: userId
    };

    try {
        await forum.submitComment(sectionID, postID, data);
        res.status(200).jsonp({
            "message": "ok"
        });
    } catch (error) {
        res.sendStatus(500).jsonp({
            "message": "上传失败"
        });
        throw error;
    }
});

router.post('/:sectionID/post/:postID/comment/:commentID', async function (req, res) {
    var userId = req.headers['User-Id'];

    var sectionID = parseInt(req.params['sectionID']);
    var postID = req.params['postID'];
    var commentID = req.params['commentID'];

    if (!userId)
        return res.status(401).jsonp({
            "message": "未登录"
        });

    if (!req.body.comment_content)
        return res.status(422).jsonp({
            "message": "评论内容不能为空"
        });

    var data = {
        comment_content: req.body.comment_content,
        comment_author: userId
    };

    try {
        let result = await forum.updateComment(sectionID, postID, commentID, data);
        res.status(200).jsonp({
            "message": "ok"
        });
    } catch (err) {
        res.status(500).jsonp({
            "message": "更新失败"
        });
    }
});
