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
        }

        sendData = {
            "message": "ok",
            "data": result
        };

        res.jsonp(sendData);
    });

    /*
     * title author content
     */

    router.post('/:sectionID/notice', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);

        var data = {
            notice_title: req.body.notice_title,
            notice_author: req.body.notice_author,
            notice_content: req.body.notice_content
        };
        var dataToSend;

        let result = await notice.submitNotice(sectionID, data);
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

    router.get('/:sectionID/notice/:noticeID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var noticeID = req.params['noticeID'];

        try {
            var result = await notice.getNoticeDetail(sectionID, noticeID);
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

    router.post('/:sectionID/notice/:noticeID', async function (req, res) {
        var sectionID = parseInt(req.params['sectionID']);
        var noticeID = req.params['noticeID'];
        var data = req.body.data;

        try {
            var result = await forum.updateNoticeList(sectionID, noticeID, data);
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

    return router;
}
