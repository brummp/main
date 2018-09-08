const express = require('express');
var router = module.exports = function(config1){
    const notice = require('notice')(config1);
    var router = express.Router();

    router.get('/:sectionID/notice', async function(req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var opt = {
            page_num: req.query['page_num']
        }
        try {
            var result = await notice.getAllNotice(sectionID,opt);
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

    /*
     * title author content
     */

    router.post('/:sectionID/notice', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        let dataToSend;
        if(!req.body.notice_title){
            dataToSend = {
                "message": "公告标题不能为空"
            };
            res.status(422).jsonp(dataToSend);
        }
        else if(!req.body.notice_author){
            dataToSend = {
                "message": "公告作者不能为空"
            };
            res.status(422).jsonp(dataToSend);
        }
        else if(!req.body.notice_content){
            dataToSend = {
                "message": "公告内容不能为空"
            };
            res.status(422).jsonp(dataToSend);
        }
        else{
            var data = {
                notice_title: req.body.notice_title,
                notice_author: req.body.notice_author,
                notice_content: req.body.notice_content
            };
        
            let result = await notice.submitNotice(sectionID, data);
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

    router.get('/:sectionID/notice/:noticeID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var noticeID = req.params['noticeID'];

        try {
            var result = await notice.getNoticeDetail(sectionID, noticeID);
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

    router.post('/:sectionID/notice/:noticeID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var noticeID = req.params['noticeID'];
        let dataToSend;

        if(!req.body.notice_title){
            dataToSend = {
                "message": "公告标题不能为空"
            };
            res.status(422).jsonp(dataToSend);
        }
        else if(!req.body.notice_author){
            dataToSend = {
                "message": "公告作者不能为空"
            };
            res.status(422).jsonp(dataToSend);
        }
        else if(!req.body.notice_content){
            dataToSend = {
                "message": "公告内容不能为空"
            };
            res.status(422).jsonp(dataToSend);
        }
        else{
            var data = req.body.data;

            try {
                var result = await forum.updateNoticeList(sectionID, noticeID, data);
            } catch (error) {
                throw error;
                res.sendStatus(500);
            }

            if (result) {
                dataToSend = {
                    "message": "OK"
                };
                res.status(200).jsonp(dataToSend);
            } else {
                dataToSend = {
                    "message": "UNKNOWN_ERR"
                };
                res.status(500).jsonp(dataToSend);
            }
        }
    });

    return router;
}
